package com.application.webapplication.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final ApplicationConfig applicationConfig;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    // Constructor Injection Standard
    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService,
            ApplicationConfig applicationConfig) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.applicationConfig = applicationConfig;
    }

    @Override

    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        // 1. Extract Token From Header
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 2. Check it token starts with "Bearer" or not
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extract the original token.applicationConfig
        jwt = authHeader.substring(7);

        // 4. Extract the email & UserDetails from Token
        userEmail = jwtService.extractUsername(jwt);

        // 5. If the Email find but user not yet authenticated
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // get user details
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 6. Check token is Valid or non-expired
            if (jwtService.isTokenValid(jwt, userDetails)) {

                // create a object for authentication token of Spring Security
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());

                // add a extra remote details which is nothing but the browser & IP
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                // says the Spring Security core brain this User is authorized
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

        }
        // send it to controller
        filterChain.doFilter(request, response);
    }

}
