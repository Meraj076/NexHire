package com.application.webapplication.Controller;

import com.application.webapplication.Entity.UserEntity;
import com.application.webapplication.Service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*") // Cors Enable for frontend communication.
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * GET METHOD: http://localhost:8080/api/v1/users/{id}
     * Description: Token verify hone ke baad database se user ka data nikalne ke
     * liye
     */

    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(authService.getUserById(id));
    }

    /**
     * DELETE METHOD: http://localhost:8080/api/v1/users/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok(authService.deleteUserById(id));
    }

    /**
     * PUT METHOD: http://localhost:8080/api/v1/users/{id}
     * Body mein sirf ek plain string bhejna naye username ke liye
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserEntity> updateUsername(@PathVariable Long id, @RequestParam String newUsername) {
        return ResponseEntity.ok(authService.updateUsername(id, newUsername));
    }

    /**
     * PUT METHOD: http://localhost:8080/api/v1/users/profile/update
     * Description: Update profile (username & email) and return new token
     * Changed path to /profile/update to avoid collision with /{id}
     */
    @PutMapping("/profile/update")
    public ResponseEntity<com.application.webapplication.DTO.AuthResponse> updateProfile(
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails,
            @RequestBody com.application.webapplication.DTO.UpdateProfileRequest request) {
        String currentEmail = userDetails.getUsername();
        return ResponseEntity.ok(authService.updateProfile(currentEmail, request));
    }

    /**
     * PUT METHOD: http://localhost:8080/api/v1/users/change-password
     */
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails,
            @RequestBody com.application.webapplication.DTO.ChangePasswordRequest request) {
        String email = userDetails.getUsername();
        return ResponseEntity.ok(authService.changePassword(email, request));
    }

    /**
     * DELETE METHOD: http://localhost:8080/api/v1/users/delete-account
     */
    @DeleteMapping("/delete-account")
    public ResponseEntity<String> deleteAccount(
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        String email = userDetails.getUsername();
        return ResponseEntity.ok(authService.deleteAccount(email));
    }

}
