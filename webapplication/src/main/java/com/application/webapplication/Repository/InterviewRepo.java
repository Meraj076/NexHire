package com.application.webapplication.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.application.webapplication.Entity.InterviewEntity;

@Repository
public interface InterviewRepo extends JpaRepository<InterviewEntity, Long> {

    // Kisi specific user ke saare interview sessions nikalne ke liye (Latest first)
    List<InterviewEntity> findByUserIdOrderByStartTimeDesc(Long userId);

    // Admin: all interviews with user eagerly loaded (avoids N+1)
    @Query("SELECT i FROM InterviewEntity i JOIN FETCH i.user ORDER BY i.startTime DESC")
    List<InterviewEntity> findAllWithUserOrderByStartTimeDesc();

    // Admin: average score across all completed interviews
    @Query("SELECT AVG(i.overall_score) FROM InterviewEntity i WHERE i.status = 'COMPLETED'")
    Double findAverageOverallScore();

    // Admin: interview count per user
    long countByUserId(Long userId);
}

