package com.application.webapplication.Controller;

import java.util.List;

import com.application.webapplication.DTO.*;
import com.application.webapplication.Service.interviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/interviews")
@CrossOrigin(origins = "*")
public class InterviewController {

    private final interviewService interviewService;

    public InterviewController(interviewService interviewService) {
        this.interviewService = interviewService;
    }

    /**
     * POST: http://localhost:8080/api/v1/interviews/start
     * Body (JSON): { "roleProfile": "Java Developer", "difficulty": "Intermediate"
     * }
     */

    @PostMapping("/start")
    public ResponseEntity<InterviewQuestionResponse> startInterview(
            @RequestBody StartInterviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        InterviewQuestionResponse response = interviewService.startInterviewRequest(request, userEmail);
        return ResponseEntity.ok(response);
    }

    /**
     * PHASE 2: Get Next Question (Fast Loop - No DB Save)
     * URL: POST http://localhost:8080/api/v1/interviews/next/{sessionId}
     */

    @PostMapping("/next/{sessionId}")
    public ResponseEntity<InterviewQuestionResponse> getNextQuestion(
            @PathVariable Long sessionId,
            @RequestBody NextQuestionRequest request) {
        InterviewQuestionResponse response = interviewService.getNextQuestion(request, sessionId);
        return ResponseEntity.ok(response);
    }

    /**
     * PHASE 3: End Interview & Bulk Evaluate (Saves Everything to DB at Once)
     * URL: POST http://localhost:8080/api/v1/interviews/end
     */

    @PostMapping("/end")
    public ResponseEntity<GeminiBulkEvaluation> endInterview(
            @RequestBody EndInterviewRequest request) {
        GeminiBulkEvaluation response = interviewService.endAndEvaluateInterview(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<InterviewHistoryDTO>> getInterviewHistory(
            @AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        return ResponseEntity.ok(interviewService.getInterviewHistory(userEmail));
    }

}
