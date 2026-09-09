package com.cinelens.backend.controller;

import com.cinelens.backend.dto.RecommendationResponse;
import com.cinelens.backend.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping
    public List<RecommendationResponse> getRecommendations(
            @RequestHeader("X-User-Id") String userId
    ) {
        return recommendationService.recommend(userId);
    }
}