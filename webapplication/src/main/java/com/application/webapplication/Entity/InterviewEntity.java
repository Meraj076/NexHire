package com.application.webapplication.Entity;

import java.time.LocalDateTime;

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
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "interview_sessions")
public class InterviewEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Direct user_id rakhne ke bajay, User object ke sath map kiya
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "role_profile", nullable = false)
    private String role_profile;

    @Column(nullable = false)
    private String difficulty;

    @Column(name = "overall_score")
    private int overall_score;

    @Column(name = "start_time", updatable = false)
    private LocalDateTime startTime;

    private String status;

    @OneToMany(mappedBy = "interviewSession", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    private java.util.List<InterviewResultEntity> results;

    @PrePersist
    protected void onCreate() {
        this.startTime = LocalDateTime.now();
    }
}
