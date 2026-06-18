package com.application.webapplication.DTO;

public record ChangePasswordRequest(
    String currentPassword,
    String newPassword
) {
}
