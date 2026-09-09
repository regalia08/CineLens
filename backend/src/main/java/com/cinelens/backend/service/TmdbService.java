package com.cinelens.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class TmdbService {

    @Value("${tmdb.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String BASE_URL = "https://api.themoviedb.org/3";

    @SuppressWarnings("unchecked")
    public Map<String, Object> getMovieDetail(Integer movieId) {
        String url = BASE_URL + "/movie/" + movieId + "?api_key=" + apiKey + "&language=ko-KR";
        return restTemplate.getForObject(url, Map.class);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getMovieCredits(Integer movieId) {
        String url = BASE_URL + "/movie/" + movieId + "/credits?api_key=" + apiKey;
        return restTemplate.getForObject(url, Map.class);
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getPopularMovies(int page) {
        String url = BASE_URL + "/movie/popular?api_key=" + apiKey + "&language=ko-KR&page=" + page;
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        return (List<Map<String, Object>>) response.get("results");
    }
}