package com.application.webapplication.DTO;

import jakarta.validation.constraints.NotBlank;

public record GoogleLoginRequest(

                @NotBlank(message = "Google Id Token missing") String idToken

) {
}
