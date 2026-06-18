package com.application.webapplication.Service;

import com.application.webapplication.DTO.*;
import com.application.webapplication.Entity.*;
import com.application.webapplication.Repository.*;
import com.application.webapplication.config.JwtService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class AdminService {

    private final UserRepo              userRepo;
    private final InterviewRepo         interviewRepo;
    private final ResumeRepo            resumeRepo;
    private final PromptConfigRepo      promptConfigRepo;
    private final ApiUsageCounterService apiUsageCounter;
    private final ErrorLogService       errorLogService;
    private final JwtService            jwtService;

    public AdminService(UserRepo userRepo,
                        InterviewRepo interviewRepo,
                        ResumeRepo resumeRepo,
                        PromptConfigRepo promptConfigRepo,
                        ApiUsageCounterService apiUsageCounter,
                        ErrorLogService errorLogService,
                        JwtService jwtService) {
        this.userRepo         = userRepo;
        this.interviewRepo    = interviewRepo;
        this.resumeRepo       = resumeRepo;
        this.promptConfigRepo = promptConfigRepo;
        this.apiUsageCounter  = apiUsageCounter;
        this.errorLogService  = errorLogService;
        this.jwtService       = jwtService;
    }

    // ─────────────────────────────────────────────────────────────────
    // 1. PLATFORM DASHBOARD — Stats & Activity Feed
    // ─────────────────────────────────────────────────────────────────

    public AdminStatsDTO getStats() {
        long totalUsers      = userRepo.count();
        long totalInterviews = interviewRepo.count();
        long totalResumes    = resumeRepo.count();

        Double avg = interviewRepo.findAverageOverallScore();
        double avgScore = (avg != null) ? Math.round(avg * 10.0) / 10.0 : 0.0;

        LocalDateTime startOfToday = LocalDateTime.now().toLocalDate().atStartOfDay();
        long todaySignups = userRepo.countByCreatedAtAfter(startOfToday);

        return new AdminStatsDTO(
                totalUsers, totalInterviews, totalResumes, avgScore, todaySignups,
                apiUsageCounter.getTodayInterviewCount(),
                apiUsageCounter.getTodayResumeCount()
        );
    }

    public List<ActivityFeedItem> getRecentActivity() {
        List<ActivityFeedItem> activities = new ArrayList<>();

        // Last 10 interview sessions
        interviewRepo.findAllWithUserOrderByStartTimeDesc()
                .stream().limit(10)
                .forEach(s -> activities.add(new ActivityFeedItem(
                        "INTERVIEW",
                        s.getUser().getEmail(),
                        s.getUser().getUsername(),
                        s.getRole_profile(),
                        s.getOverall_score(),
                        s.getStartTime()
                )));

        // Last 10 resumes
        resumeRepo.findAllWithUserOrderByUploadedAtDesc()
                .stream().limit(10)
                .forEach(r -> activities.add(new ActivityFeedItem(
                        "RESUME",
                        r.getUser().getEmail(),
                        r.getUser().getUsername(),
                        r.getFile_name(),
                        r.getAts_score(),
                        r.getUploadedAt()
                )));

        // Sort merged list by timestamp desc, return top 20
        activities.sort((a, b) -> b.timestamp().compareTo(a.timestamp()));
        return activities.stream().limit(20).toList();
    }

    // ─────────────────────────────────────────────────────────────────
    // 2. USER MANAGEMENT
    // ─────────────────────────────────────────────────────────────────

    public List<AdminUserDTO> getAllUsers() {
        return userRepo.findAllByOrderByCreatedAtDesc().stream().map(user ->
                new AdminUserDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.isBlocked(),
                        user.getCreatedAt(),
                        interviewRepo.countByUserId(user.getId()),
                        resumeRepo.countByUserId(user.getId())
                )
        ).toList();
    }

    public String toggleBlockUser(Long userId) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setBlocked(!user.isBlocked());
        userRepo.save(user);
        return user.isBlocked() ? "User blocked successfully." : "User unblocked successfully.";
    }

    public String deleteUser(Long userId) {
        if (!userRepo.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        userRepo.deleteById(userId);
        return "User deleted successfully.";
    }

    public String changeUserRole(Long userId, String newRole) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Safeguard 1: Prevent currently logged in user from modifying their own role
        String currentUserEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        if (user.getEmail().equalsIgnoreCase(currentUserEmail)) {
            throw new RuntimeException("You cannot modify your own role!");
        }

        // Safeguard 2: Ensure there is always at least one administrator in the system
        if (user.getRole() == Role.ADMIN && "USER".equalsIgnoreCase(newRole)) {
            long adminCount = userRepo.countByRole(Role.ADMIN);
            if (adminCount <= 1) {
                throw new RuntimeException("Cannot downgrade the only remaining administrator!");
            }
        }

        user.setRole(Role.valueOf(newRole.toUpperCase()));
        userRepo.save(user);
        return "Role updated to " + newRole.toUpperCase();
    }

    /**
     * Generates a short-lived impersonation JWT for the target user.
     * The token is flagged with "impersonated: true" in its claims.
     */
    public String impersonateUser(Long userId) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRole().name())
                .build();

        Map<String, Object> claims = new HashMap<>();
        claims.put("role",         user.getRole().name());
        claims.put("userId",       user.getId());
        claims.put("username",     user.getUsername());
        claims.put("impersonated", true);

        // Generate a 15-minute short-lived impersonation token (15 * 60 * 1000 = 900,000 ms)
        return jwtService.generateToken(claims, userDetails, 900000L);
    }

    // ─────────────────────────────────────────────────────────────────
    // 3. AI & API ANALYTICS
    // ─────────────────────────────────────────────────────────────────

    public ApiUsageDTO getApiUsageStats() {
        return new ApiUsageDTO(
                apiUsageCounter.getTodayInterviewCount(),
                apiUsageCounter.getTodayResumeCount(),
                apiUsageCounter.getTotalToday()
        );
    }

    public List<AdminInterviewDTO> getAllInterviews() {
        return interviewRepo.findAllWithUserOrderByStartTimeDesc().stream().map(s ->
                new AdminInterviewDTO(
                        s.getId(),
                        s.getUser().getEmail(),
                        s.getUser().getUsername(),
                        s.getRole_profile(),
                        s.getDifficulty(),
                        s.getOverall_score(),
                        s.getStatus(),
                        s.getStartTime()
                )
        ).toList();
    }

    public List<AdminResumeDTO> getAllResumes() {
        return resumeRepo.findAllWithUserOrderByUploadedAtDesc().stream().map(r ->
                new AdminResumeDTO(
                        r.getId(),
                        r.getUser().getEmail(),
                        r.getUser().getUsername(),
                        r.getFile_name(),
                        r.getAts_score(),
                        r.getUploadedAt()
                )
        ).toList();
    }

    // ─────────────────────────────────────────────────────────────────
    // 4. DYNAMIC PROMPT MANAGEMENT
    // ─────────────────────────────────────────────────────────────────

    public List<PromptConfigEntity> getAllPrompts() {
        return promptConfigRepo.findAll();
    }

    public PromptConfigEntity updatePrompt(String promptKey, String promptValue) {
        PromptConfigEntity prompt = promptConfigRepo.findByPromptKey(promptKey)
                .orElse(PromptConfigEntity.builder().promptKey(promptKey).build());
        prompt.setPromptValue(promptValue);
        return promptConfigRepo.save(prompt);
    }

    // ─────────────────────────────────────────────────────────────────
    // 5. SUPPORT & ERROR LOGS
    // ─────────────────────────────────────────────────────────────────

    public List<ErrorLogEntity> getErrorLogs() {
        return errorLogService.getRecentLogs();
    }

    public void clearErrorLogs() {
        errorLogService.clearAllLogs();
    }
}
