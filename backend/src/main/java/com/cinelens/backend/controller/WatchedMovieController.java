package com.cinelens.backend.controller;

import com.cinelens.backend.dto.WatchedMovieRequest;
import com.cinelens.backend.dto.WatchedMovieResponse;
import com.cinelens.backend.service.WatchedMovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/watched-movies")
@RequiredArgsConstructor
public class WatchedMovieController {

    private final WatchedMovieService service;

    // 등록 (또는 평점 포함 등록)
    @PostMapping
    public WatchedMovieResponse register(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody WatchedMovieRequest request
    ) {
        return service.register(userId, request);
    }

    // 내가 본 영화 목록
    @GetMapping
    public List<WatchedMovieResponse> getMyList(
            @RequestHeader("X-User-Id") String userId
    ) {
        return service.getMyList(userId);
    }

    // 평점 수정
    @PutMapping("/{movieId}")
    public WatchedMovieResponse updateRating(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable Integer movieId,
            @Valid @RequestBody WatchedMovieRequest request
    ) {
        return service.updateRating(userId, movieId, request.getRating());
    }

    // 삭제
    @DeleteMapping("/{movieId}")
    public void delete(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable Integer movieId
    ) {
        service.delete(userId, movieId);
    }
}