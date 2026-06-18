package com.application.webapplication.DTO;

import java.util.List;

public record EndInterviewRequest(
        Long sessionId,
        List<QnaRequest> qnaList) {
}