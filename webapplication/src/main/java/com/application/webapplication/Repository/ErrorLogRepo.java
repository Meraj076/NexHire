package com.application.webapplication.Repository;

import com.application.webapplication.Entity.ErrorLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ErrorLogRepo extends JpaRepository<ErrorLogEntity, Long> {
    // Latest errors first
    List<ErrorLogEntity> findAllByOrderByOccurredAtDesc();
}
