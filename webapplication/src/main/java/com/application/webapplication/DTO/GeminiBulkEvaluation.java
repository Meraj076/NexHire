package com.application.webapplication.DTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record GeminiBulkEvaluation(
        @JsonProperty("overallScore") @JsonAlias("overall_score") int overallScore,

        @JsonProperty("evaluations") List<GeminiSingleEval> evaluations) {
    public record GeminiSingleEval(
            @JsonProperty("question") String question,
            @JsonProperty("answer") String answer,
            @JsonProperty("feedbackScore") @JsonAlias("feedback_score") int feedbackScore,
            @JsonProperty("identifiedWeakness") @JsonAlias("identified_weakness") String identifiedWeakness,
            @JsonProperty("remediationGuide") @JsonAlias("remediation_guide") String remediationGuide) {
    }
}