package com.project.StressPrediction.service;

import com.project.StressPrediction.model.PredictionRequest;
import com.project.StressPrediction.model.StressPrediction;
import com.project.StressPrediction.model.User;
import com.project.StressPrediction.repository.StressPredictionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StressService {

    @Autowired
    private StressPredictionRepository predictionRepository;

    public StressPrediction calculate(PredictionRequest request) {
        double totalScore = 0;
        List<Double> answers = request.getAnswers();
        
        if (answers != null && !answers.isEmpty()) {
            for (Double val : answers) {
                totalScore += val;
            }
        }

        // Heuristic Logic
        int questionCount = answers != null ? answers.size() : 10; 
        double maxScore = questionCount * 5.0;
        
        double percentage = (maxScore > 0) ? (totalScore / maxScore) * 100 : 0;
        
        String label;
        if (percentage <= 33) {
            label = "Low Stress";
        } else if (percentage <= 66) {
            label = "Moderate Stress";
        } else {
            label = "High Stress";
        }

        StressPrediction prediction = new StressPrediction();
        prediction.setScore(percentage);
        prediction.setLabel(label);
        prediction.setAnswers(answers != null ? answers.toString() : "[]");
        
        return prediction;
    }

    public StressPrediction save(StressPrediction prediction, User user) {
        prediction.setUser(user);
        return predictionRepository.save(prediction);
    }

    public StressPrediction calculateAndSave(User user, PredictionRequest request) {
        StressPrediction prediction = calculate(request);
        return save(prediction, user);
    }

    public List<StressPrediction> getHistory(User user) {
        return predictionRepository.findByUserOrderByCreatedAtDesc(user);
    }
}
