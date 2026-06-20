package com.application.webapplication.DTO;

import java.time.LocalDateTime;

public record AdminResumeDTO(
        Long id,
        String userEmail,
        String username,
        String fileName,
        int atsScore,
        LocalDateTime uploadedAt
) {}
