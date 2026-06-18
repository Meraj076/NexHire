package com.application.webapplication.DTO;

public record UpdateProfileRequest(
    String username,
    String email
) {
}
