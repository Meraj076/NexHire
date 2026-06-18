package com.application.webapplication.DTO;

public record AuthResponse(
        String token,
        String username,
        String email,
        String role) {
}
