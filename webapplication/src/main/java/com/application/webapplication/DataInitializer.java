package com.application.webapplication;

import com.application.webapplication.Entity.PromptConfigEntity;
import com.application.webapplication.Repository.PromptConfigRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds the default Gemini prompt templates into the prompt_config table
 * on first startup. If a key already exists, it is NOT overwritten,
 * so admin-edited values are preserved across restarts.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final PromptConfigRepo promptConfigRepo;

    public DataInitializer(PromptConfigRepo promptConfigRepo) {
        this.promptConfigRepo = promptConfigRepo;
    }

    @Override
    public void run(String... args) {
        seedPrompt(
            "interview_first_question",
            "First Interview Question Generator",
            "You are an expert technical interviewer. Generate exactly ONE technical interview question for a {difficulty} level {roleProfile} position. Do not include any greetings, markdown, quotes, or explanations. Just return the raw question string."
        );

        seedPrompt(
            "interview_next_question",
            "Next Interview Question Generator",
            "You are an expert technical interviewer for a {difficulty} {roleProfile} role. The candidate just answered this question: '{previousQuestion}' with: '{previousAnswer}'. Based on their answer, generate EXACTLY ONE next technical interview question. Do not evaluate the answer. Do not include markdown, greetings, or quotes. Just the raw question text."
        );

        seedPrompt(
            "interview_bulk_eval",
            "Interview Bulk Evaluator",
            "You are an expert ATS evaluator. Evaluate the following interview QnA history for a {difficulty} {roleProfile} role. Provide an overall score (out of 100) and evaluate each question out of 10. Return STRICTLY in this JSON format without markdown:\n{\"overallScore\": 85, \"evaluations\": [{\"question\": \"What is Java?\", \"answer\": \"OOP language\", \"feedbackScore\": 8, \"identifiedWeakness\": \"Too brief.\", \"remediationGuide\": \"Explain OOP concepts like inheritance.\"}]}\n\nHere is the QnA History:\n{qnaHistory}"
        );

        seedPrompt(
            "resume_analysis",
            "Resume ATS Analyzer",
            "You are an expert ATS (Applicant Tracking System) backend analyzer. Analyze the provided resume text and return a response strictly in the following JSON format. Do not include markdown code blocks, backticks, or text before/after the JSON string. JSON Schema: {\"atsScore\": 85, \"extractedSkill\": \"Java, Spring Boot, MySQL, REST APIs\", \"aiSuggestion\": \"Enhance cloud deployment section. Add project descriptions.\", \"missingKeywords\": \"Docker, AWS, Kubernetes\"}\nResume Text to analyze:\n{resumeText}"
        );

        System.out.println("✅ DataInitializer: Default prompt templates seeded successfully.");
    }

    private void seedPrompt(String key, String description, String defaultValue) {
        if (promptConfigRepo.findByPromptKey(key).isEmpty()) {
            promptConfigRepo.save(
                PromptConfigEntity.builder()
                    .promptKey(key)
                    .description(description)
                    .promptValue(defaultValue)
                    .build()
            );
            System.out.println("   → Seeded prompt: " + key);
        } else {
            System.out.println("   → Skipped (already exists): " + key);
        }
    }
}
