package com.cinelens.backend.dto;

import com.cinelens.backend.entity.WatchedMovie;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class WatchedMovieResponse {
    private final Long id;
    private final Integer movieId;
    private final Double rating;
    private final LocalDateTime watchedAt;

    public WatchedMovieResponse(WatchedMovie entity) {
        this.id = entity.getId();
        this.movieId = entity.getMovieId();
        this.rating = entity.getRating();
        this.watchedAt = entity.getWatchedAt();
    }
}