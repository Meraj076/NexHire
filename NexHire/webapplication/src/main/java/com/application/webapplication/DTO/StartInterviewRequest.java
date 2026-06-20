package com.application.webapplication.DTO;

public record StartInterviewRequest(
        String roleProfile, // e.g., "Frontend Developer"
        String difficulty // e.g., "Beginner", "Intermediate", "Advanced"
) {
}