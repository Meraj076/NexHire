package com.application.webapplication.Controller;

import com.application.webapplication.DTO.*;
import com.application.webapplication.Entity.ErrorLogEntity;
import com.application.webapplication.Entity.PromptConfigEntity;
import com.application.webapplication.Service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * All endpoints here require ADMIN authority.
 * Security enforcement is done in SecurityConfig:
 *   .requestMatchers("/api/v1/admin/**").hasAuthority("ADMIN")
 */
@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ─────────────────────────────────────────────────────────────────
    // 1. PLATFORM DASHBOARD
    // ─────────────────────────────────────────────────────────────────

    /** GET /api/v1/admin/stats — overall platform stats card data */
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    /** GET /api/v1/admin/activity — recent 20 merged events (interviews + resumes) */
    @GetMapping("/activity")
    public ResponseEntity<List<ActivityFeedItem>> getRecentActivity() {
        return ResponseEntity.ok(adminService.getRecentActivity());
    }

    // ─────────────────────────────────────────────────────────────────
    // 2. USER MANAGEMENT
    // ─────────────────────────────────────────────────────────────────

    /** GET /api/v1/admin/users — list all users */
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    /** PUT /api/v1/admin/users/{id}/block — toggle block status */
    @PutMapping("/users/{id}/block")
    public ResponseEntity<String> toggleBlockUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleBlockUser(id));
    }

    /** PUT /api/v1/admin/users/{id}/role — change user role (body: { "role": "ADMIN" }) */
    @PutMapping("/users/{id}/role")
    public ResponseEntity<String> changeUserRole(
            @PathVariable Long id,
            @RequestBody UpdateRoleRequest request) {
        return ResponseEntity.ok(adminService.changeUserRole(id, request.role()));
    }

    /** DELETE /api/v1/admin/users/{id} — hard delete user + cascaded data */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.deleteUser(id));
    }

    /** GET /api/v1/admin/users/{id}/impersonate — returns a temp JWT for this user */
    @GetMapping("/users/{id}/impersonate")
    public ResponseEntity<Map<String, String>> impersonateUser(@PathVariable Long id) {
        String token = adminService.impersonateUser(id);
        return ResponseEntity.ok(Map.of("token", token));
    }

    // ─────────────────────────────────────────────────────────────────
    // 3. AI & API ANALYTICS
    // ─────────────────────────────────────────────────────────────────

    /** GET /api/v1/admin/api-usage — today's Gemini call counts */
    @GetMapping("/api-usage")
    public ResponseEntity<ApiUsageDTO> getApiUsage() {
        return ResponseEntity.ok(adminService.getApiUsageStats());
    }

    /** GET /api/v1/admin/interviews — all interview sessions across all users */
    @GetMapping("/interviews")
    public ResponseEntity<List<AdminInterviewDTO>> getAllInterviews() {
        return ResponseEntity.ok(adminService.getAllInterviews());
    }

    /** GET /api/v1/admin/resumes — all resume uploads across all users */
    @GetMapping("/resumes")
    public ResponseEntity<List<AdminResumeDTO>> getAllResumes() {
        return ResponseEntity.ok(adminService.getAllResumes());
    }

    // ─────────────────────────────────────────────────────────────────
    // 4. DYNAMIC PROMPT MANAGEMENT
    // ─────────────────────────────────────────────────────────────────

    /** GET /api/v1/admin/prompts — all 4 prompt config entries */
    @GetMapping("/prompts")
    public ResponseEntity<List<PromptConfigEntity>> getAllPrompts() {
        return ResponseEntity.ok(adminService.getAllPrompts());
    }

    /** PUT /api/v1/admin/prompts/{key} — update a prompt by its key */
    @PutMapping("/prompts/{key}")
    public ResponseEntity<PromptConfigEntity> updatePrompt(
            @PathVariable String key,
            @RequestBody UpdatePromptRequest request) {
        return ResponseEntity.ok(adminService.updatePrompt(key, request.promptValue()));
    }

    // ─────────────────────────────────────────────────────────────────
    // 5. SUPPORT & ERROR LOGS
    // ─────────────────────────────────────────────────────────────────

    /** GET /api/v1/admin/logs — all error logs, latest first */
    @GetMapping("/logs")
    public ResponseEntity<List<ErrorLogEntity>> getErrorLogs() {
        return ResponseEntity.ok(adminService.getErrorLogs());
    }

    /** DELETE /api/v1/admin/logs — clear all error logs */
    @DeleteMapping("/logs")
    public ResponseEntity<String> clearErrorLogs() {
        adminService.clearErrorLogs();
        return ResponseEntity.ok("All error logs cleared.");
    }
}
