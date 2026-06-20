package com.project.StressPrediction.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Allow everything for now (simplifying for demo)
            )
            .csrf(csrf -> csrf.disable()) // Disable CSRF for easier API testing
            .headers(headers -> headers.frameOptions(frame -> frame.disable())); // Allow H2 console
        
        return http.build();
    }
}
