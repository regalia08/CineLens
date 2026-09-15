package com.cinelens.backend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WatchedMovieRequest {
    private Integer movieId;

    @DecimalMin(value = "0.0", message = "평점은 0 이상이어야 합니다.")
    @DecimalMax(value = "5.0", message = "평점은 5 이하여야 합니다.")
    private Double rating;
}