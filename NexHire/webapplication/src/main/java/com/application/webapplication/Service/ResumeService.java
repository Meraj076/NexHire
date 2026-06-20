package com.application.webapplication.Service;

import com.application.webapplication.DTO.ResumeHistoryDTO;
import com.application.webapplication.DTO.GeminiAnalysisResult;
import com.application.webapplication.DTO.ResumeResponse;
import com.application.webapplication.Entity.ResumeEntity;
import com.application.webapplication.Entity.UserEntity;
import com.application.webapplication.Repository.ResumeRepo;
import com.application.webapplication.Repository.UserRepo;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ResumeService {

    private final ResumeRepo resumeRepo;
    private final UserRepo userRepo;
    private final GeminiAiService geminiAiService;
    private final ErrorLogService errorLogService;
    private final Tika tika = new Tika();

    public ResumeService(ResumeRepo resumeRepo, UserRepo userRepo, GeminiAiService geminiAiService, ErrorLogService errorLogService) {
        this.resumeRepo = resumeRepo;
        this.userRepo = userRepo;
        this.geminiAiService = geminiAiService;
        this.errorLogService = errorLogService;
    }

    /*
     * Upload and Parse Real PDF Resume
     */

    public ResumeResponse saveResume(MultipartFile file, String userEmail) {
        try {
            // 1. check User
            UserEntity user = userRepo.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not Found !"));

            // 2. Apache Tika extract the all Resume Data
            String extractedText = tika.parseToString(file.getInputStream());

            // Hit the Gemini Live Analysis
            GeminiAnalysisResult aiResult = geminiAiService.analyzeResumeContent(extractedText);

            // 3. Prepare entity Object
            ResumeEntity resume = ResumeEntity.builder()
                    .user(user)
                    .file_name(file.getOriginalFilename())
                    .pdfData(file.getBytes()) // Original PDF save in a database
                    .resumeText(extractedText) // Extracted text fromResume save on DB
                    .ats_score(aiResult.atsScore())
                    .extracted_skill(aiResult.extractedSkill())
                    .ai_suggestion(aiResult.aiSuggestion())
                    .missing_keywords(aiResult.missingKeywords())
                    .build();

            ResumeEntity savedResume = resumeRepo.save(resume);

            // Entity class mapped in DTO Class
            return new ResumeResponse(
                    savedResume.getId(),
                    savedResume.getFile_name(),
                    savedResume.getAts_score(),
                    savedResume.getExtracted_skill(),
                    savedResume.getAi_suggestion(),
                    savedResume.getMissing_keywords(),
                    savedResume.getUploadedAt(),
                    "SUCCESSFULLY_UPLOADED");

        } catch (Exception e) {
            errorLogService.log("/api/v1/resumes/upload", userEmail, e.getMessage(), 500);
            throw new RuntimeException("Failed to save resume : " + e.getMessage());
        }
    }

    public List<ResumeHistoryDTO> getResumeHistory(String userEmail) {
        UserEntity user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not Found!"));

        List<ResumeEntity> resumes = resumeRepo.findByUserIdOrderByUploadedAtDesc(user.getId());

        return resumes.stream().map(resume -> new com.application.webapplication.DTO.ResumeHistoryDTO(
                resume.getId(),
                resume.getFile_name(),
                resume.getAts_score(),
                resume.getUploadedAt())).toList();
    }

}
