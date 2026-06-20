package com.application.webapplication.Service;

import com.application.webapplication.DTO.InterviewHistoryDTO;
import com.application.webapplication.DTO.EndInterviewRequest;
import com.application.webapplication.DTO.GeminiBulkEvaluation;
import com.application.webapplication.DTO.InterviewQuestionResponse;
import com.application.webapplication.DTO.NextQuestionRequest;
import com.application.webapplication.DTO.QnaRequest;
import com.application.webapplication.DTO.StartInterviewRequest;
import com.application.webapplication.Entity.InterviewEntity;
import com.application.webapplication.Entity.InterviewResultEntity;
import com.application.webapplication.Entity.UserEntity;
import com.application.webapplication.Repository.InterviewRepo;
import com.application.webapplication.Repository.interviewResultRepo;
import com.application.webapplication.Repository.UserRepo;
import org.springframework.stereotype.Service;

import java.util.*;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class interviewService {

        private final InterviewRepo interviewRepo;
        private final interviewResultRepo resultRepo;
        private final UserRepo userRepo;
        private final GeminiAiService geminiAiService;
        private final ErrorLogService errorLogService;

        public interviewService(InterviewRepo interviewRepo, interviewResultRepo resultRepo, UserRepo userRepo,
                        GeminiAiService geminiAiService, ErrorLogService errorLogService) {
                this.interviewRepo = interviewRepo;
                this.resultRepo = resultRepo;
                this.userRepo = userRepo;
                this.geminiAiService = geminiAiService;
                this.errorLogService = errorLogService;
        }

        /**
         * PHASE 1: Start a new Interview Session
         */

        public InterviewQuestionResponse startInterviewRequest(StartInterviewRequest request, String userEmail) {

                try {
                // 1. Get Logged in User
                UserEntity user = userRepo.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User Not Found"));

                // 2. Create New Interview Session in Database
                InterviewEntity interviewEntity = InterviewEntity.builder()
                                .user(user)
                                .role_profile(request.roleProfile())
                                .difficulty(request.difficulty())
                                .status("STARTED")
                                .overall_score(0)
                                .build();

                InterviewEntity savedSession = interviewRepo.save(interviewEntity);

                // 3. Ask Gemini for First Question
                String firstQuestion = geminiAiService.generateFirstQuestion(request.roleProfile(),
                                request.difficulty());

                // 4. Return DTO to Frontend
                return new InterviewQuestionResponse(savedSession.getId(), firstQuestion);
                } catch (Exception e) {
                        errorLogService.log("/api/v1/interviews/start", userEmail, e.getMessage(), 500);
                        throw new RuntimeException("Failed to start interview: " + e.getMessage(), e);
                }
        }

        /**
         * PHASE 2: Ask for Next Question (No DB Interaction)
         */

        public InterviewQuestionResponse getNextQuestion(NextQuestionRequest request, Long sessionId) {
                String nextQuestion = geminiAiService.generateNextQuestion(
                                request.roleProfile(),
                                request.difficulty(),
                                request.previousQuestion(),
                                request.previousAnswer());
                return new InterviewQuestionResponse(sessionId, nextQuestion);
        }

        /**
         * PHASE 3: End Interview, Bulk Evaluate, and Save to DB
         */

        // 1. GEt session from DB
        public GeminiBulkEvaluation endAndEvaluateInterview(EndInterviewRequest request) {

                try {
                InterviewEntity session = interviewRepo.findById(request.sessionId())
                                .orElseThrow(() -> new RuntimeException("Session Not Found"));

                // 2. Format QnA history for Gemini
                StringBuilder qnaHistory = new StringBuilder();
                for (int i = 0; i < request.qnaList().size(); i++) {
                        QnaRequest qna = request.qnaList().get(i);
                        qnaHistory.append("Q").append(i + 1).append(": ").append(qna.question()).append("\n");
                        qnaHistory.append("A").append(i + 1).append(": ").append(qna.answer()).append("\n\n");
                }

                // 3.Get Bulk Evaluation from Gemini
                GeminiBulkEvaluation bulkResult = geminiAiService.evaluateBlukQnA(
                                session.getRole_profile(),
                                session.getDifficulty(),
                                qnaHistory.toString());

                // . save each result in InterviewResultENtity table
                List<InterviewResultEntity> resultsToSave = new ArrayList<>();
                for (GeminiBulkEvaluation.GeminiSingleEval eval : bulkResult.evaluations()) {
                        InterviewResultEntity result = InterviewResultEntity.builder()
                                        .interviewSession(session)
                                        .question_text(eval.question())
                                        .user_answer(eval.answer())
                                        .feedback_score(eval.feedbackScore())
                                        .identified_weakness(eval.identifiedWeakness())
                                        .remediation_guide(eval.remediationGuide())
                                        .build();
                        resultsToSave.add(result);
                }
                resultRepo.saveAll(resultsToSave); // Save All at once!

                // 5. Update main InterviewEntity status and score
                session.setOverall_score(bulkResult.overallScore());
                session.setStatus("COMPLETED");
                interviewRepo.save(session);

                return bulkResult;
                } catch (Exception e) {
                        errorLogService.log("/api/v1/interviews/end", null, e.getMessage(), 500);
                        throw new RuntimeException("Failed to evaluate interview: " + e.getMessage(), e);
                }
        }

        public List<InterviewHistoryDTO> getInterviewHistory(String userEmail) {
                UserEntity user = userRepo.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User Not Found"));

                List<InterviewEntity> sessions = interviewRepo.findByUserIdOrderByStartTimeDesc(user.getId());

                return sessions.stream().map(session -> new com.application.webapplication.DTO.InterviewHistoryDTO(
                                session.getId(),
                                session.getRole_profile(),
                                session.getOverall_score(),
                                session.getStartTime(),
                                session.getStatus())).toList();
        }

}
