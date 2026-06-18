package com.application.webapplication.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "error_logs")
public class ErrorLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String endpoint;

    // nullable — some errors happen before we know who the user is
    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "http_status")
    private int httpStatus;

    @Column(name = "occurred_at", updatable = false)
    private LocalDateTime occurredAt;

    @PrePersist
    protected void onCreate() {
        this.occurredAt = LocalDateTime.now();
    }
}
