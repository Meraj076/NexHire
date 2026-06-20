package com.application.webapplication.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(AuthenticationProvider authenticationProvider, JwtAuthenticationFilter jwtAuthFilter) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. CSRF protection disabled because we use a JWT token.
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Enable CORS with our custom config bean below.
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. Set EndPoint permission checkpost.
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**").permitAll() // signup/login bina token ke aane do.
                        .requestMatchers("/api/v1/admin/**").hasAuthority("ADMIN") // Admin-only routes
                        .requestMatchers("/api/v1/users/**").authenticated()
                        .requestMatchers("/api/v1/resumes/**").authenticated()
                        .requestMatchers("/api/v1/interviews/**").authenticated()
                        .requestMatchers("/error").permitAll()
                        .anyRequest().authenticated())

                // 4. (JWT Rules) set Session STATELESS (Because JWT is enough to manage state)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 5. Attach a Database custom provider.
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                // 6. Set Cross-Origin-Opener-Policy to same-origin-allow-popups for Google OAuth popups
                .headers(headers -> headers
                        .crossOriginOpenerPolicy(coop -> coop.policy(
                                org.springframework.security.web.header.writers.CrossOriginOpenerPolicyHeaderWriter.CrossOriginOpenerPolicy.SAME_ORIGIN_ALLOW_POPUPS
                        ))
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Frontend origins allowed
        config.setAllowedOriginPatterns(List.of("*"));

        // HTTP methods allowed
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // Headers allowed (including Authorization for JWT)
        config.setAllowedHeaders(List.of("*"));

        // Allow cookies / Authorization header to be sent
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
