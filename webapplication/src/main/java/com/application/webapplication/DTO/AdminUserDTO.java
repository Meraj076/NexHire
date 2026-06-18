package com.application.webapplication.DTO;

import java.time.LocalDateTime;

public record AdminUserDTO(
        Long id,
        String username,
        String email,
        String role,
        boolean isBlocked,
        LocalDateTime createdAt,
        long interviewCount,
        long resumeCount
) {}
