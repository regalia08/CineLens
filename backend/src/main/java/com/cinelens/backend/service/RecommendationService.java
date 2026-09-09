package com.cinelens.backend.service;

import com.cinelens.backend.dto.RecommendationResponse;
import com.cinelens.backend.entity.WatchedMovie;
import com.cinelens.backend.repository.WatchedMovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final WatchedMovieRepository watchedMovieRepository;
    private final TmdbService tmdbService;

    private static final double MAX_RATING = 5.0;
    private static final int CANDIDATE_PAGES = 3;
    private static final int PRELIM_TOP_N = 15;
    private static final int FINAL_TOP_N = 10;

    @SuppressWarnings("unchecked")
    public List<RecommendationResponse> recommend(String userId) {
        List<WatchedMovie> watched = watchedMovieRepository.findByUserId(userId);
        Set<Integer> watchedIds = watched.stream()
                .map(WatchedMovie::getMovieId)
                .collect(Collectors.toSet());

        if (watched.isEmpty()) {
            return Collections.emptyList();
        }

        // 1. 취향 분석
        Map<Integer, Double> genreWeightSum = new HashMap<>();
        Map<Integer, List<Double>> genreRatings = new HashMap<>();
        Map<String, Double> directorScore = new HashMap<>();

        for (WatchedMovie wm : watched) {
            double rating = wm.getRating() != null ? wm.getRating() : 3.0;
            double weight = rating / MAX_RATING;

            Map<String, Object> detail = tmdbService.getMovieDetail(wm.getMovieId());
            List<Map<String, Object>> genres = (List<Map<String, Object>>) detail.get("genres");
            if (genres != null) {
                for (Map<String, Object> g : genres) {
                    Integer gid = (Integer) g.get("id");
                    genreWeightSum.merge(gid, weight, Double::sum);
                    genreRatings.computeIfAbsent(gid, k -> new ArrayList<>()).add(rating);
                }
            }

            Map<String, Object> credits = tmdbService.getMovieCredits(wm.getMovieId());
            List<Map<String, Object>> crew = (List<Map<String, Object>>) credits.get("crew");
            if (crew != null) {
                crew.stream()
                        .filter(c -> "Director".equals(c.get("job")))
                        .forEach(c -> directorScore.merge((String) c.get("name"), weight, Double::sum));
            }
        }

        double maxGenreWeight = genreWeightSum.values().stream().mapToDouble(v -> v).max().orElse(1.0);

        Set<String> topDirectors = directorScore.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .limit(3)
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());

        Set<Integer> topGenres = genreWeightSum.entrySet().stream()
                .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                .limit(3)
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());

        // 2. 후보 영화 수집
        List<Map<String, Object>> candidates = new ArrayList<>();
        for (int page = 1; page <= CANDIDATE_PAGES; page++) {
            candidates.addAll(tmdbService.getPopularMovies(page));
        }

        // 3. 1차 점수 (장르 40% + 평점 20% + 유사도 10%)
        List<Map.Entry<Map<String, Object>, Double>> prelim = new ArrayList<>();
        for (Map<String, Object> movie : candidates) {
            Integer movieId = (Integer) movie.get("id");
            if (watchedIds.contains(movieId)) continue;

            List<Integer> genreIds = (List<Integer>) movie.get("genre_ids");
            if (genreIds == null || genreIds.isEmpty()) continue;

            double genreSum = genreIds.stream()
                    .mapToDouble(gid -> genreWeightSum.getOrDefault(gid, 0.0))
                    .sum();
            double genreScore = (genreSum / genreIds.size()) / maxGenreWeight;

            double ratingSum = 0;
            int ratingCount = 0;
            for (Integer gid : genreIds) {
                List<Double> ratings = genreRatings.get(gid);
                if (ratings != null) {
                    ratingSum += ratings.stream().mapToDouble(r -> r).sum();
                    ratingCount += ratings.size();
                }
            }
            double ratingScore = ratingCount > 0 ? (ratingSum / ratingCount) / MAX_RATING : 0;

            Set<Integer> candidateGenreSet = new HashSet<>(genreIds);
            Set<Integer> union = new HashSet<>(candidateGenreSet);
            union.addAll(topGenres);
            Set<Integer> intersection = new HashSet<>(candidateGenreSet);
            intersection.retainAll(topGenres);
            double similarityScore = union.isEmpty() ? 0 : (double) intersection.size() / union.size();

            double prelimScore = genreScore * 0.4 + ratingScore * 0.2 + similarityScore * 0.1;
            prelim.add(Map.entry(movie, prelimScore));
        }

        List<Map.Entry<Map<String, Object>, Double>> topPrelim = prelim.stream()
                .sorted(Map.Entry.<Map<String, Object>, Double>comparingByValue().reversed())
                .limit(PRELIM_TOP_N)
                .collect(Collectors.toList());

        // 4. 최종 점수 (감독 30% 추가)
        List<RecommendationResponse> results = new ArrayList<>();
        for (Map.Entry<Map<String, Object>, Double> entry : topPrelim) {
            Map<String, Object> movie = entry.getKey();
            Integer movieId = (Integer) movie.get("id");

            Map<String, Object> credits = tmdbService.getMovieCredits(movieId);
            List<Map<String, Object>> crew = (List<Map<String, Object>>) credits.get("crew");
            boolean directorMatch = crew != null && crew.stream()
                    .filter(c -> "Director".equals(c.get("job")))
                    .anyMatch(c -> topDirectors.contains(c.get("name")));

            double finalScore = entry.getValue() + (directorMatch ? 0.3 : 0);

            results.add(RecommendationResponse.builder()
                    .movieId(movieId)
                    .title((String) movie.get("title"))
                    .posterPath((String) movie.get("poster_path"))
                    .score(Math.round(finalScore * 1000) / 1000.0)
                    .reason(buildReason(directorMatch, entry.getValue()))
                    .build());
        }

        return results.stream()
                .sorted(Comparator.comparingDouble(RecommendationResponse::getScore).reversed())
                .limit(FINAL_TOP_N)
                .collect(Collectors.toList());
    }

    private String buildReason(boolean directorMatch, double prelimScore) {
        if (directorMatch && prelimScore > 0.5) return "선호 장르와 감독이 모두 취향과 잘 맞는 영화입니다.";
        if (directorMatch) return "선호하는 감독의 작품입니다.";
        if (prelimScore > 0.5) return "평소 선호하는 장르와 유사한 영화입니다.";
        return "취향과 어느 정도 맞는 영화입니다.";
    }
}