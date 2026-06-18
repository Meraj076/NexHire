package com.application.webapplication.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "interview_qnas")
public class InterviewResultEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Interview session ke sath connection
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private InterviewEntity interviewSession;

    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String question_text;

    @Column(name = "user_answer", columnDefinition = "TEXT")
    private String user_answer;

    @Column(name = "feedback_score")
    private int feedback_score;

    @Column(name = "identified_weakness", columnDefinition = "TEXT")
    private String identified_weakness;

    // Concept Remediation ka dropdown content isme store hoga
    @Column(name = "remediation_guide", columnDefinition = "TEXT")
    private String remediation_guide;
}
