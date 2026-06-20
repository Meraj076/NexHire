package com.application.webapplication.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.application.webapplication.Entity.ResumeEntity;

@Repository
public interface ResumeRepo extends JpaRepository<ResumeEntity, Long> {

    // Kisi specific user ke saare interview sessions nikalne ke liye (Latest first)
    List<ResumeEntity> findByUserIdOrderByUploadedAtDesc(Long userId);

    // Admin: all resumes with user eagerly loaded (avoids N+1)
    @Query("SELECT r FROM ResumeEntity r JOIN FETCH r.user ORDER BY r.uploadedAt DESC")
    List<ResumeEntity> findAllWithUserOrderByUploadedAtDesc();

    // Admin: resume count per user
    long countByUserId(Long userId);
}

