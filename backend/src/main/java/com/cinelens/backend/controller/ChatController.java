package com.cinelens.backend.controller;

import com.cinelens.backend.dto.ChatRequest;
import com.cinelens.backend.dto.ChatResponse;
import com.cinelens.backend.service.LlmService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final LlmService llmService;

    @PostMapping
    public ChatResponse chat(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody ChatRequest request
    ) {
        String reply = llmService.chat(request.message(), userId);
        return new ChatResponse(reply);
    }
}