package com.application.webapplication.DTO;

import java.time.LocalDateTime;

public record AdminInterviewDTO(
        Long id,
        String userEmail,
        String username,
        String roleProfile,
        String difficulty,
        int overallScore,
        String status,
        LocalDateTime startTime
) {}
