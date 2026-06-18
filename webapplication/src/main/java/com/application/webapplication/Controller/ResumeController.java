package com.application.webapplication.Controller;

import java.util.List;

import com.application.webapplication.DTO.ResumeHistoryDTO;
import com.application.webapplication.DTO.ResumeResponse;
import com.application.webapplication.Entity.ResumeEntity;
import com.application.webapplication.Service.ResumeService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/resumes")
@CrossOrigin(origins = "*")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    /**
     * UPLOAD REAL PDF: http://localhost:8080/api/v1/resumes/upload
     * Content-Type must be: multipart/form-data
     */

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResumeResponse> uploadResume(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        return ResponseEntity.ok(resumeService.saveResume(file, userEmail));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ResumeHistoryDTO>> getResumeHistory(@AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        return ResponseEntity.ok(resumeService.getResumeHistory(userEmail));
    }

}
