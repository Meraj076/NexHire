package com.application.webapplication.Service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.beans.factory.annotation.Value;

import java.util.HashMap;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.application.webapplication.DTO.AuthRequest;
import com.application.webapplication.DTO.AuthResponse;
import com.application.webapplication.DTO.RegisterRequest;
import com.application.webapplication.Entity.Role;
import com.application.webapplication.Entity.UserEntity;
import com.application.webapplication.Repository.UserRepo;
import com.application.webapplication.config.JwtService;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

        @Value("${application.security.google.client-id}")
        private String googleClientId;

        @Value("${application.security.admin-emails:}")
        private String adminEmails;

        // 1. Dependencies Declaration.
        private final UserRepo userRepo;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        // 2. Constructor For Injecting Dependencies(Loose Coupling Standard).
        public AuthService(UserRepo userRepo,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService,
                        AuthenticationManager authenticationManager) {
                this.userRepo = userRepo;
                this.passwordEncoder = passwordEncoder;
                this.jwtService = jwtService;
                this.authenticationManager = authenticationManager;
        }

        /* User Registeration Logic(For Future Purpose). */

        public AuthResponse register(RegisterRequest request) {

                // Validation: check if email already exists so, Gives a message.

                if (userRepo.existsByEmail(request.email())) {
                        throw new RuntimeException("Email Already Exists.");
                }

                // DTO to Entity Manual Mapping + Password Encryption.

                UserEntity newUser = UserEntity.builder()
                                .username(request.username())
                                .email(request.email())
                                .password(passwordEncoder.encode(request.password()))// Password Hashing
                                .role(determineRole(request.email()))// Determine role dynamically based on configured admin emails
                                .build();

                // Saving Entity into MySQL Database
                UserEntity savedUser = userRepo.save(newUser);

                // Convert save user to Spring Security's UserDetails for JWT generation.
                UserDetails userDetails = User.builder()
                                .username(savedUser.getEmail())
                                .password(savedUser.getPassword())
                                .authorities(savedUser.getRole().name())
                                .build();

                // Prepare extra claims for JWT payload (Frontend requires Role and
                // ID).interviewRepo_3
                HashMap<String, Object> claims = new HashMap<>();
                claims.put("role", savedUser.getRole().name());
                claims.put("userId", savedUser.getId());

                // Geberate the JWT Token
                String jwtToken = jwtService.generateToken(claims, userDetails);

                // Return to the Frontend via AuthResponse DTO.

                return new AuthResponse(
                                jwtToken,
                                savedUser.getUsername(),
                                savedUser.getEmail(),
                                savedUser.getRole().name());

        }

        /* User Authentication Logic */

        public AuthResponse Authenticate(AuthRequest request) {

                // 1. Authentication credentials against Spring security configuration

                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.email(),
                                                request.password()));

                // Fetch valid user information from Database

                UserEntity user = userRepo.findByEmail(request.email())
                                .orElseThrow(() -> new RuntimeException("User not Find in DataBase!"));

                // Convertto Standard Spring Security UserDetails Interface

                UserDetails userDetails = User.builder()
                                .username(user.getEmail())
                                .password(user.getPassword())
                                .authorities(user.getRole().name())
                                .build();
                // Inject roles and data to token claims layer.
                HashMap<String, Object> claims = new HashMap<>();
                claims.put("role", user.getRole().name());
                claims.put("userId", user.getId());

                String jwtToken = jwtService.generateToken(claims, userDetails);

                return new AuthResponse(
                                jwtToken,
                                user.getUsername(),
                                user.getEmail(),
                                user.getRole().name());
        }

        /**
         * GOOGLE OAUTH 2.0 LOGIN LOGIC
         */

        public AuthResponse googleLogin(com.application.webapplication.DTO.GoogleLoginRequest request) {
                try {
                        // 1. Official initialize the NetHttpTransport and JsonFactory to Google.
                        NetHttpTransport transport = new NetHttpTransport();
                        GsonFactory jsonFactory = GsonFactory.getDefaultInstance();

                        // 2. set up a Token verification with google client Id.
                        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                                        transport, jsonFactory)
                                        .setAudience(Collections.singletonList(googleClientId))
                                        .build();

                        // 3. Verify the Token sent from the Frontend.
                        GoogleIdToken idToken = verifier.verify(request.idToken());

                        if (idToken == null) {
                                throw new RuntimeException("Invalid Google Id Token.");
                        }

                        // 4. Extract user payload (User Detail)
                        GoogleIdToken.Payload payload = idToken.getPayload();
                        String email = payload.getEmail();
                        String username = (String) payload.get("name");

                        // 5. Check if User exist in our DB or not?
                        java.util.Optional<UserEntity> existingUser = userRepo.findByEmail(email);
                        UserEntity user;

                        if (existingUser.isPresent()) {
                                // if the User present, Directly use it.
                                user = existingUser.get();
                        } else {
                                // if the User not present, create New DB entry for that Google user.
                                user = UserEntity.builder()
                                                .username(username)
                                                .email(email)
                                                .password(passwordEncoder.encode(
                                                                "GOOGLE_AUTH_PROTECTED_" + UUID.randomUUID()))
                                                .role(determineRole(email))// Determine role dynamically based on configured admin emails
                                                .build();
                                user = userRepo.save(user);

                        }

                        // 6. prepare the standard Spring Security UserDetails for Token
                        UserDetails userDetails = User.builder()
                                        .username(user.getEmail())
                                        .password(user.getPassword())
                                        .authorities(user.getRole().name())
                                        .build();
                        // Inject extra claims
                        Map<String, Object> claims = new HashMap<>();
                        claims.put("role", user.getRole().name());
                        claims.put("userId", user.getId());

                        // Generate Fresh JWT Token for Google User
                        String jwtToken = jwtService.generateToken(claims, userDetails);

                        return new AuthResponse(
                                        jwtToken,
                                        user.getUsername(),
                                        user.getEmail(),
                                        user.getRole().name()

                        );
                } catch (Exception e) {
                        throw new RuntimeException("Google Login Failed: " + e.getMessage());
                }

        }

        // User Details Fetch Method.
        public UserEntity getUserById(Long id) {
                return userRepo.findById(id)
                                .orElseThrow(() -> new RuntimeException("User Not Found!"));
        }

        // DELETE USER BY ID
        public String deleteUserById(Long id) {
                if (!userRepo.existsById(id)) {
                        throw new RuntimeException("User Not Found!");
                }
                userRepo.deleteById(id);
                return "User deleted successfully!";
        }

        // UPDATE USERNAME BY ID
        public UserEntity updateUsername(Long id, String newUsername) {
                UserEntity user = userRepo.findById(id)
                                .orElseThrow(() -> new RuntimeException("User Not Found!"));

                user.setUsername(newUsername);
                return userRepo.save(user);
        }

        // UPDATE PROFILE (Username and Email) and Return New Token
        public AuthResponse updateProfile(String currentEmail, com.application.webapplication.DTO.UpdateProfileRequest request) {
                UserEntity user = userRepo.findByEmail(currentEmail)
                                .orElseThrow(() -> new RuntimeException("User Not Found!"));

                if (!user.getEmail().equals(request.email()) && userRepo.existsByEmail(request.email())) {
                        throw new RuntimeException("Email is already in use by another account.");
                }

                user.setUsername(request.username());
                user.setEmail(request.email());
                UserEntity savedUser = userRepo.save(user);

                // Generate new token with updated email
                UserDetails userDetails = User.builder()
                                .username(savedUser.getEmail())
                                .password(savedUser.getPassword())
                                .authorities(savedUser.getRole().name())
                                .build();
                
                HashMap<String, Object> claims = new HashMap<>();
                claims.put("role", savedUser.getRole().name());
                claims.put("userId", savedUser.getId());

                String jwtToken = jwtService.generateToken(claims, userDetails);

                return new AuthResponse(
                                jwtToken,
                                savedUser.getUsername(),
                                savedUser.getEmail(),
                                savedUser.getRole().name()
                );
        }

        // CHANGE PASSWORD
        public String changePassword(String email, com.application.webapplication.DTO.ChangePasswordRequest request) {
                UserEntity user = userRepo.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User Not Found!"));

                // Verify old password
                if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
                        throw new RuntimeException("Incorrect current password.");
                }

                // Encrypt and save new password
                user.setPassword(passwordEncoder.encode(request.newPassword()));
                userRepo.save(user);
                
                return "Password changed successfully!";
        }

        // DELETE ACCOUNT (Uses CascadeType.ALL to delete history)
        public String deleteAccount(String email) {
                UserEntity user = userRepo.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User Not Found!"));
                
                userRepo.delete(user);
                return "Account and history deleted successfully.";
        }

        private Role determineRole(String email) {
                if (adminEmails != null && !adminEmails.trim().isEmpty()) {
                        for (String adminEmail : adminEmails.split(",")) {
                                if (adminEmail.trim().equalsIgnoreCase(email.trim())) {
                                        return Role.ADMIN;
                                }
                        }
                }
                return Role.USER;
        }
}
