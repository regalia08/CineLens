package com.cinelens.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RecommendationResponse {
    private Integer movieId;
    private String title;
    private String posterPath;
    private double score;
    private String reason;
}