package com.application.webapplication.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.application.webapplication.Entity.InterviewResultEntity;

@Repository
public interface interviewResultRepo extends JpaRepository<InterviewResultEntity, Long> {

    // Ek specific interview session ke saare QnAs (sawaal-javaab) nikalne ke liye
    List<InterviewResultEntity> findByInterviewSessionId(Long sessionId);

}