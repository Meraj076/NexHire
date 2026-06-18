package com.application.webapplication.DTO;

import java.time.LocalDateTime;

public record ResumeHistoryDTO(
    Long id,
    String fileName,
    int atsScore,
    LocalDateTime uploadedAt
) {}
