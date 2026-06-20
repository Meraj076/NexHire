package com.application.webapplication.DTO;

import java.time.LocalDateTime;

public record ResumeResponse(
        Long id,
        String fileName,
        int atsScore,
        String extractedSkill,
        String aiSuggestion,
        String missingKeywords,
        LocalDateTime uploadedAt,
        String status) {
}
