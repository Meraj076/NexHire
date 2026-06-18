package com.application.webapplication.DTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO FOR HOLDING GEMINI AI ANALYSIS RESULT
 * Industry Standard: Adding JsonProperty and JsonAlias ensures that even if AI
 * returns camelCase or snake_case, serialization/deserialization never breaks.
 */
public record GeminiAnalysisResult(
                @JsonProperty("atsScore") @JsonAlias("ats_score") int atsScore,

                @JsonProperty("extractedSkill") @JsonAlias("extracted_skill") String extractedSkill,

                @JsonProperty("aiSuggestion") @JsonAlias("ai_suggestion") String aiSuggestion,

                @JsonProperty("missingKeywords") @JsonAlias("missing_keywords") String missingKeywords) {
}