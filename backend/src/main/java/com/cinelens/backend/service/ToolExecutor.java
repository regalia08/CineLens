package com.cinelens.backend.service;

import com.cinelens.backend.dto.WatchedMovieResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.stream.Collectors;
import com.cinelens.backend.dto.WatchedMovieRequest;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ToolExecutor {

    private final WatchedMovieService watchedMovieService;
    private final RecommendationService recommendationService;
    private final TmdbService tmdbService;

    public List<Map<String, Object>> getWatchedMovies(String userId) {
        List<WatchedMovieResponse> watched = watchedMovieService.getMyList(userId);

        return watched.stream()
                .map(w -> {
                    Map<String, Object> detail = tmdbService.getMovieDetail(w.getMovieId());
                    Map<String, Object> result = new HashMap<>();
                    result.put("movieId", w.getMovieId());
                    result.put("title", detail.get("title"));
                    result.put("rating", w.getRating());
                    result.put("watchedAt", w.getWatchedAt());
                    return result;
                })
                .collect(Collectors.toList());
    }

    public Object recommendMovies(String userId) {
        return recommendationService.recommend(userId);
    }

    public Object searchMovies(String query) {
        return tmdbService.searchMovies(query);
    }
    
    public Object addWatchedMovie(String userId, Integer movieId, Double rating) {
        WatchedMovieRequest request = new WatchedMovieRequest();
        request.setMovieId(movieId);
        request.setRating(rating);
        return watchedMovieService.register(userId, request);
    }

    public Object updateRating(String userId, Integer movieId, Double rating) {
        return watchedMovieService.updateRating(userId, movieId, rating);
    }

    public Object deleteWatchedMovie(String userId, Integer movieId) {
        watchedMovieService.delete(userId, movieId);
        return Map.of("deleted", true, "movieId", movieId);
    }
}