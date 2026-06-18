package com.application.webapplication.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.application.webapplication.Entity.UserEntity;

@Repository
public interface UserRepo extends JpaRepository<UserEntity, Long> {
    // JWT aur Login ke waqt database se user ko email se dhoodne ke liye
    Optional<UserEntity> findByEmail(String email);

    // Signup ke waqt check karne ke liye ki email pehle se register toh nahi hai
    boolean existsByEmail(String email);

    // Admin: today's new signup count
    long countByCreatedAtAfter(LocalDateTime since);

    // Admin: all users sorted by newest first
    java.util.List<UserEntity> findAllByOrderByCreatedAtDesc();

    // Admin: count users by role
    long countByRole(com.application.webapplication.Entity.Role role);
}

