package com.application.webapplication.DTO;

public record InterviewQuestionResponse(
        Long sessionId, // Taki frontend agle sawal me bata sake ki kis session ka answer de raha hai
        String questionText // AI dwara pucha gaya sawal
) {
}