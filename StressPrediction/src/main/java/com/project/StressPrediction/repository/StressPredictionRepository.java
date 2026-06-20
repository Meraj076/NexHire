package com.project.StressPrediction.repository;

import com.project.StressPrediction.model.StressPrediction;
import com.project.StressPrediction.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StressPredictionRepository extends JpaRepository<StressPrediction, Long> {
    List<StressPrediction> findByUserOrderByCreatedAtDesc(User user);
}
