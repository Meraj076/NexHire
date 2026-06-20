package com.project.StressPrediction.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
public class StressPrediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private double score; // 0 to 100
    private String label; // "Low Stress", "Moderate Stress", "High Stress"

    @Column(columnDefinition = "TEXT")
    private String answers; // Store JSON string of answers if needed

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getAnswers() { return answers; }
    public void setAnswers(String answers) { this.answers = answers; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
