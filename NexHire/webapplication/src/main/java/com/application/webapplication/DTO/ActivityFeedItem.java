package com.application.webapplication.DTO;

import java.time.LocalDateTime;

public record ActivityFeedItem(
        String type,        // "INTERVIEW" or "RESUME"
        String userEmail,
        String username,
        String detail,      // e.g. "Frontend Developer", "resume.pdf"
        int score,          // overall_score or ats_score
        LocalDateTime timestamp
) {}
