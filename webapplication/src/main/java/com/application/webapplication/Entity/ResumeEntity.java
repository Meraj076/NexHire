package com.application.webapplication.Entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "resumedetail_table")
public class ResumeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "file_name", nullable = false)
    private String file_name;

    @Lob
    @Column(name = "pdf_data", nullable = false)
    private byte[] pdfData;

    @Column(name = "resume_text", columnDefinition = "TEXT")
    private String resumeText;

    @Column(name = "ats_score")
    private int ats_score;

    @Column(name = "extracted_skill", columnDefinition = "TEXT")
    private String extracted_skill;

    @Column(name = "ai_suggestion", columnDefinition = "TEXT")
    private String ai_suggestion;

    @Column(name = "missing_keywords", columnDefinition = "TEXT")
    private String missing_keywords;

    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        this.uploadedAt = LocalDateTime.now();
    }
}