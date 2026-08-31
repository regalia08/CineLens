package com.cinelens.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WatchedMovieRequest {
    private Integer movieId;
    private Double rating; // 등록 시 null 가능 (일단 "봤어요"만 누른 경우)
}