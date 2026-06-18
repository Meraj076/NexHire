package com.application.webapplication.DTO;

public record NextQuestionRequest(
        String roleProfile,
        String difficulty,
        String previousQuestion,
        String previousAnswer) {
}