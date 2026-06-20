package com.project.StressPrediction.controller;

import com.project.StressPrediction.model.User;
import com.project.StressPrediction.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, Object> payload) {
        try {
            String username = (String) payload.get("username");
            String email = (String) payload.get("email");
            String password = (String) payload.get("password");
            int age = Integer.parseInt(payload.get("age").toString());

            User user = userService.registerUser(username, email, password, age);
            return ResponseEntity.ok(Map.of("message", "User registered successfully", "userId", user.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload, HttpSession session) {
        String email = payload.get("email");
        String password = payload.get("password");

        User user = userService.loginUser(email, password);
        if (user != null) {
            session.setAttribute("user", user);
            return ResponseEntity.ok(Map.of("message", "Login successful", "username", user.getUsername()));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }
}
