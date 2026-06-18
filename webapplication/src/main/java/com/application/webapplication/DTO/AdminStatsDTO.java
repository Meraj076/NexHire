package com.application.webapplication.DTO;

public record AdminStatsDTO(
        long totalUsers,
        long totalInterviews,
        long totalResumes,
        double avgInterviewScore,
        long todaySignups,
        int todayInterviews,
        int todayResumes
) {}
