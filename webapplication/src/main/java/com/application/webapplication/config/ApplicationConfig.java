package com.application.webapplication.config;

import com.application.webapplication.Repository.UserRepo;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class ApplicationConfig {

    private final UserRepo userRepo;

    public ApplicationConfig(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    // 1. UserDetailsService: To fetch user data from DB.

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepo.findByEmail(username)
                .map(userEntity -> User.builder()
                        .username(userEntity.getEmail())
                        .password(userEntity.getPassword())
                        .authorities(userEntity.getRole().name())
                        .disabled(userEntity.isBlocked()) // Blocked users cannot log in
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found!"));
    }

    // 2. AuthenticationProvider: To check if the credentials(Password) are correct.

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // 3. AuthenticationManager: To manage the authentication process.

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // 4. PasswordEncoder: To Encrypt/Hash the password.

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
