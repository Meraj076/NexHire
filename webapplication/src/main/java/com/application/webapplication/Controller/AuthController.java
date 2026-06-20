package com.application.webapplication.Controller;

import com.application.webapplication.DTO.GoogleLoginRequest;
import com.application.webapplication.DTO.AuthRequest;
import com.application.webapplication.DTO.AuthResponse;
import com.application.webapplication.DTO.RegisterRequest;
import com.application.webapplication.Service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*") // React frontend (port 5173/3000) ko backend hit karne dene ke liye (CORS
                            // solution)
public class AuthController {
    private final AuthService authService;

    // Constructor Injection Standard
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * ENDPOINT: http://localhost:8080/api/v1/auth/register
     * Description: It is for new user to Sign up & register.
     */

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegisterRequest request) {

        // Data pass to a Service layer and service layer response a 200 ok and token &
        // user data.

        return ResponseEntity.ok(authService.register(request));
    }

    /**
     * ENDPOINT: http://localhost:8080/api/v1/auth/authenticate
     * Description: It is for old user to login)
     */

    @PostMapping("/authenticate")
    public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody AuthRequest request) {

        // Check the credential then return the token and response.

        return ResponseEntity.ok(authService.Authenticate(request));
    }

    /**
     * ENDPOINT: http://localhost:8080/api/v1/auth/google
     * Description: Google Login handler bina frontend ke testing ke liye
     */
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(
            @jakarta.validation.Valid @RequestBody GoogleLoginRequest request) {
        return ResponseEntity.ok(authService.googleLogin(request));
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("OK");
    }

}
