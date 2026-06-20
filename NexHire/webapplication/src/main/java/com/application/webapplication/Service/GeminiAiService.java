package com.application.webapplication.Service;

import com.application.webapplication.DTO.GeminiAnalysisResult;
import com.application.webapplication.DTO.GeminiBulkEvaluation;
import com.application.webapplication.Repository.PromptConfigRepo;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiAiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper;
    private final PromptConfigRepo promptConfigRepo;
    private final ApiUsageCounterService apiUsageCounter;

    @Value("${gemini.model:gemini-2.5-flash-lite}")
    private String geminiModel;

    private String getApiUrl() {
        return "https://generativelanguage.googleapis.com/v1beta/models/" + geminiModel + ":generateContent?key=" + apiKey;
    }

    public GeminiAiService(PromptConfigRepo promptConfigRepo, ApiUsageCounterService apiUsageCounter) {
        this.promptConfigRepo = promptConfigRepo;
        this.apiUsageCounter  = apiUsageCounter;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    /**
     * Fetches the prompt template from DB by key.
     * Falls back to the hardcoded default if the DB entry is missing.
     */
    private String getPrompt(String key, String fallback) {
        return promptConfigRepo.findByPromptKey(key)
                .map(p -> p.getPromptValue())
                .orElse(fallback);
    }

    /** Calls Gemini API and returns the raw text response. */
    private String callGemini(String prompt) throws Exception {
        String apiUrl = getApiUrl();

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> partsMap = new HashMap<>();
        partsMap.put("parts", List.of(textPart));

        Map<String, Object> contentsMap = new HashMap<>();
        contentsMap.put("contents", List.of(partsMap));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(contentsMap, headers);
        ResponseEntity<String> responseEntity = restTemplate.postForEntity(apiUrl, requestEntity, String.class);

        JsonNode rootNode = objectMapper.readTree(responseEntity.getBody());
        String rawText = rootNode.path("candidates")
                .get(0).path("content").path("parts").get(0).path("text")
                .asText().trim();

        // Strip markdown code fences if present
        if (rawText.startsWith("```json")) {
            rawText = rawText.substring(7, rawText.lastIndexOf("```")).trim();
        } else if (rawText.startsWith("```")) {
            rawText = rawText.substring(3, rawText.lastIndexOf("```")).trim();
        }

        return rawText;
    }

    /** Calls Gemini API with conversation history and system instructions for chatbot. */
    public String callGeminiWithHistory(List<Map<String, Object>> contents) throws Exception {
        String apiUrl = getApiUrl();

        String systemPrompt = "You are PrepBot, an expert AI interview coach for Prep-AI platform.\n\n"
                + "Your core specialties:\n"
                + "- Mock technical interview practice (DSA, System Design, Frontend, Backend, Full Stack)\n"
                + "- Resume review, ATS optimization, and bullet point improvements\n"
                + "- Behavioral interview coaching using STAR method\n"
                + "- Career advice for software engineers and developers\n"
                + "- Interview tips, common mistakes, and best practices\n"
                + "- Salary negotiation guidance\n\n"
                + "Your personality:\n"
                + "- Friendly, encouraging, and professional\n"
                + "- Give concise but complete answers\n"
                + "- Use bullet points and structured responses when helpful\n"
                + "- If someone wants to practice, ask them questions and evaluate their answers\n"
                + "- Always be supportive and motivating\n\n"
                + "Important rules:\n"
                + "- Stay focused on interview prep, career advice, and resume topics\n"
                + "- If asked off-topic questions, gently redirect to interview/career topics\n"
                + "- Keep responses clear and actionable\n"
                + "- Use markdown formatting for better readability (bold, bullets, code blocks for code)";

        Map<String, Object> systemTextPart = new HashMap<>();
        systemTextPart.put("text", systemPrompt);

        Map<String, Object> systemInstruction = new HashMap<>();
        systemInstruction.put("parts", List.of(systemTextPart));

        Map<String, Object> payload = new HashMap<>();
        payload.put("contents", contents);
        payload.put("system_instruction", systemInstruction);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);
        ResponseEntity<String> responseEntity = restTemplate.postForEntity(apiUrl, requestEntity, String.class);

        JsonNode rootNode = objectMapper.readTree(responseEntity.getBody());
        return rootNode.path("candidates")
                .get(0).path("content").path("parts").get(0).path("text")
                .asText().trim();
    }

    /**
     * Resume ATS Analysis using Gemini AI.
     */
    public GeminiAnalysisResult analyzeResumeContent(String resumeText) {
        try {
            String defaultPrompt =
                "You are an expert ATS (Applicant Tracking System) backend analyzer. Analyze the provided resume text and return a response strictly in the following JSON format. Do not include markdown code blocks, backticks, or text before/after the JSON string. "
                + "JSON Schema: "
                + "{\"atsScore\": 85, \"extractedSkill\": \"Java, Spring Boot, MySQL, REST APIs\","
                + "\"aiSuggestion\": \"Enhance cloud deployment section.\", \"missingKeywords\": \"Docker, AWS\"}"
                + "\nResume Text to analyze:\n{resumeText}";

            String template = getPrompt("resume_analysis", defaultPrompt);
            String prompt = template.replace("{resumeText}", resumeText);

            String rawAiText = callGemini(prompt);
            apiUsageCounter.incrementResumeCount();

            return objectMapper.readValue(rawAiText, GeminiAnalysisResult.class);

        } catch (Exception e) {
            System.err.println("CRITICAL: Resume analysis failed: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to analyze resume via Gemini.", e);
        }
    }

    /**
     * PHASE 1: Generate First Interview Question.
     */
    public String generateFirstQuestion(String roleProfile, String difficulty) {
        try {
            String defaultPrompt =
                "You are an expert technical interviewer. Generate exactly ONE technical interview question for a "
                + "{difficulty} level {roleProfile} position. "
                + "Do not include any greetings, markdown, quotes, or explanations. Just return the raw question string.";

            String template = getPrompt("interview_first_question", defaultPrompt);
            String prompt = template
                    .replace("{roleProfile}", roleProfile)
                    .replace("{difficulty}", difficulty);

            String result = callGemini(prompt);
            apiUsageCounter.incrementInterviewCount();
            return result;

        } catch (Exception e) {
            System.err.println("CRITICAL: First question generation failed: " + e.getMessage());
            return "Could you please introduce yourself and share your experience with " + roleProfile + "?";
        }
    }

    /**
     * PHASE 2: Generate Next Interview Question.
     */
    public String generateNextQuestion(String roleProfile, String difficulty,
                                       String previousQuestion, String previousAnswer) {
        try {
            String defaultPrompt =
                "You are an expert technical interviewer for a {difficulty} {roleProfile} role. "
                + "The candidate just answered this question: '{previousQuestion}' with: '{previousAnswer}'. "
                + "Based on their answer, generate EXACTLY ONE next technical interview question. "
                + "Do not evaluate the answer. Do not include markdown, greetings, or quotes. Just the raw question text.";

            String template = getPrompt("interview_next_question", defaultPrompt);
            String prompt = template
                    .replace("{roleProfile}",       roleProfile)
                    .replace("{difficulty}",        difficulty)
                    .replace("{previousQuestion}",  previousQuestion)
                    .replace("{previousAnswer}",    previousAnswer);

            return callGemini(prompt);

        } catch (Exception e) {
            return "Could you elaborate more on your previous project experiences?";
        }
    }

    /**
     * PHASE 3: Bulk Evaluate all QnA pairs at end of interview.
     */
    public GeminiBulkEvaluation evaluateBlukQnA(String roleProfile, String difficulty, String qnaHistoryText) {
        try {
            String defaultPrompt =
                "You are an expert ATS evaluator. Evaluate the following interview QnA history for a "
                + "{difficulty} {roleProfile} role. "
                + "Provide an overall score (out of 100) and evaluate each question out of 10. "
                + "Return STRICTLY in this JSON format without markdown:\n"
                + "{\"overallScore\": 85, \"evaluations\": [{\"question\": \"What is Java?\", \"answer\": \"OOP language\","
                + "\"feedbackScore\": 8, \"identifiedWeakness\": \"Too brief.\", \"remediationGuide\": \"Explain OOP concepts.\"}]}"
                + "\n\nHere is the QnA History:\n{qnaHistory}";

            String template = getPrompt("interview_bulk_eval", defaultPrompt);
            String prompt = template
                    .replace("{roleProfile}", roleProfile)
                    .replace("{difficulty}",  difficulty)
                    .replace("{qnaHistory}",  qnaHistoryText);

            String rawAiText = callGemini(prompt);

            if (!rawAiText.startsWith("{") || !rawAiText.endsWith("}")) {
                throw new RuntimeException("AI returned invalid JSON: " + rawAiText);
            }

            return objectMapper.readValue(rawAiText, GeminiBulkEvaluation.class);

        } catch (Exception e) {
            System.err.println("Failed to bulk evaluate QnA: " + e.getMessage());
            return new GeminiBulkEvaluation(0, java.util.Collections.emptyList());
        }
    }
}