package com.application.webapplication.DTO;

import java.time.LocalDateTime;

public record InterviewHistoryDTO(
    Long id,
    String roleProfile,
    int overallScore,
    LocalDateTime startTime,
    String status
) {}
