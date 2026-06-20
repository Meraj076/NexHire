package com.project.StressPrediction.controller;

import com.project.StressPrediction.model.PredictionRequest;
import com.project.StressPrediction.model.StressPrediction;
import com.project.StressPrediction.model.User;
import com.project.StressPrediction.service.StressService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PredictionController {

    @Autowired
    private StressService stressService;

    @PostMapping("/predict")
    public ResponseEntity<?> predict(@RequestBody PredictionRequest request, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
             // Guest mode: Calculate only, do not save
             StressPrediction prediction = stressService.calculate(request);
             return ResponseEntity.ok(prediction);
        }

        StressPrediction prediction = stressService.calculateAndSave(user, request);
        return ResponseEntity.ok(prediction);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not logged in"));
        }
        List<StressPrediction> history = stressService.getHistory(user);
        return ResponseEntity.ok(history);
    }
    
    @GetMapping("/user/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
             return ResponseEntity.status(401).body(Map.of("error", "Not logged in"));
        }
        return ResponseEntity.ok(Map.of("username", user.getUsername(), "email", user.getEmail(), "role", "User"));
    }
}
