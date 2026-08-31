package com.cinelens.backend.service;

import com.cinelens.backend.dto.WatchedMovieRequest;
import com.cinelens.backend.dto.WatchedMovieResponse;
import com.cinelens.backend.entity.WatchedMovie;
import com.cinelens.backend.repository.WatchedMovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WatchedMovieService {

    private final WatchedMovieRepository repository;

    // 등록 (이미 있으면 평점만 업데이트)
    public WatchedMovieResponse register(String userId, WatchedMovieRequest request) {
        WatchedMovie entity = repository.findByUserIdAndMovieId(userId, request.getMovieId())
                .orElseGet(WatchedMovie::new);

        entity.setUserId(userId);
        entity.setMovieId(request.getMovieId());
        entity.setRating(request.getRating());

        WatchedMovie saved = repository.save(entity);
        return new WatchedMovieResponse(saved);
    }

    // 내가 본 영화 목록 조회
    public List<WatchedMovieResponse> getMyList(String userId) {
        return repository.findByUserId(userId).stream()
                .map(WatchedMovieResponse::new)
                .collect(Collectors.toList());
    }

    // 평점 수정
    public WatchedMovieResponse updateRating(String userId, Integer movieId, Double rating) {
        WatchedMovie entity = repository.findByUserIdAndMovieId(userId, movieId)
                .orElseThrow(() -> new IllegalArgumentException("시청 기록이 없습니다."));
        entity.setRating(rating);
        return new WatchedMovieResponse(repository.save(entity));
    }

    // 삭제
    public void delete(String userId, Integer movieId) {
        WatchedMovie entity = repository.findByUserIdAndMovieId(userId, movieId)
                .orElseThrow(() -> new IllegalArgumentException("시청 기록이 없습니다."));
        repository.delete(entity);
    }
}