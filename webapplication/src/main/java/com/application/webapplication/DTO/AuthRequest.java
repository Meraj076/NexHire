package com.application.webapplication.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthRequest(
        @NotBlank(message = "email is required") @Email(message = "email is not valid") String email,

        @NotBlank(message = "password is required") String password) {
}