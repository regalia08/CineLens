package com.cinelens.backend.service;

public interface LlmService {
    String chat(String userMessage, String userId);
}