package com.application.webapplication.Controller;

import com.application.webapplication.Service.GeminiAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final GeminiAiService geminiAiService;

    public ChatController(GeminiAiService geminiAiService) {
        this.geminiAiService = geminiAiService;
    }

    /**
     * POST: http://localhost:8081/api/v1/chat
     * Body (JSON): List of conversation history objects
     */
    @PostMapping
    public ResponseEntity<String> chat(@RequestBody List<Map<String, Object>> contents) {
        try {
            String aiResponse = geminiAiService.callGeminiWithHistory(contents);
            return ResponseEntity.ok(aiResponse);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to get chat response: " + e.getMessage());
        }
    }
}
