package com.cinelens.backend.repository;

import com.cinelens.backend.entity.WatchedMovie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchedMovieRepository extends JpaRepository<WatchedMovie, Long> {

    // 특정 유저의 시청 기록 전체 조회
    List<WatchedMovie> findByUserId(String userId);

    // 특정 유저가 특정 영화를 이미 봤는지 확인 (중복 등록 방지, 수정 시 조회)
    Optional<WatchedMovie> findByUserIdAndMovieId(String userId, Integer movieId);
}