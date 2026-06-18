package com.application.webapplication.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "username is required")
    String username,

    @NotBlank(message = "email is required")
    @Email(message = "email is not valid")
    String email,

    @NotBlank(message = "password is required")
    @Size(min = 6, message = "Password kam se kam 6 characters ka hona chahiye")
    String password
) {}