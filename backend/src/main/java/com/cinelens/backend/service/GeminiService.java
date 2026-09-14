package com.cinelens.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.*;

@Service
@RequiredArgsConstructor
public class GeminiService implements LlmService {

    private final ToolExecutor toolExecutor;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String MODEL = "gemini-3.6-flash";
    private static final String URL_TEMPLATE =
            "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";

    private static final int MAX_TURNS = 5;

    @Override
    @SuppressWarnings("unchecked")
    public String chat(String userMessage, String userId) {
        List<Map<String, Object>> contents = new ArrayList<>();
        contents.add(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", userMessage))
        ));

        for (int turn = 0; turn < MAX_TURNS; turn++) {
            Map<String, Object> requestBody = Map.of(
                    "contents", contents,
                    "tools", List.of(Map.of("functionDeclarations", getToolDeclarations()))
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            String url = String.format(URL_TEMPLATE, MODEL, apiKey);
            Map<String, Object> response;
            try {
                response = restTemplate.postForObject(url, entity, Map.class);
            } catch (HttpClientErrorException.TooManyRequests e) {
                return "지금 요청이 많아 응답이 지연되고 있어요. 잠시 후 다시 시도해주세요.";
            }

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> candidate = candidates.get(0);
            Map<String, Object> content = (Map<String, Object>) candidate.get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");

            // 이번 응답을 대화 기록에 추가 (다음 턴을 위해)
            contents.add(Map.of("role", "model", "parts", parts));

            Map<String, Object> functionCallPart = parts.stream()
                    .filter(p -> p.containsKey("functionCall"))
                    .findFirst()
                    .orElse(null);

            if (functionCallPart == null) {
                // 함수 호출이 없으면 = 최종 답변. 텍스트 합쳐서 반환
                StringBuilder sb = new StringBuilder();
                for (Map<String, Object> p : parts) {
                    if (p.containsKey("text")) {
                        sb.append(p.get("text"));
                    }
                }
                return sb.toString();
            }

            // 함수 호출 실행
            Map<String, Object> functionCall = (Map<String, Object>) functionCallPart.get("functionCall");
            String functionName = (String) functionCall.get("name");
            Map<String, Object> args = (Map<String, Object>) functionCall.getOrDefault("args", Map.of());

            Object result = executeTool(functionName, args, userId);

            // 실행 결과를 다음 턴 입력으로 추가
            Map<String, Object> functionResponsePart = Map.of(
                    "functionResponse", Map.of(
                            "name", functionName,
                            "response", Map.of("result", result)
                    )
            );
            contents.add(Map.of("role", "user", "parts", List.of(functionResponsePart)));
        }

        return "죄송해요, 요청을 처리하는 데 시간이 너무 오래 걸렸어요. 다시 시도해주세요.";
    }

    private Object executeTool(String name, Map<String, Object> args, String userId) {
        return switch (name) {
            case "get_watched_movies" -> toolExecutor.getWatchedMovies(userId);
            case "recommend_movies" -> toolExecutor.recommendMovies(userId);
            case "search_movies" -> toolExecutor.searchMovies((String) args.get("query"));
            default -> Map.of("error", "알 수 없는 도구: " + name);
        };
    }

    private List<Map<String, Object>> getToolDeclarations() {
        return List.of(
                Map.of(
                        "name", "get_watched_movies",
                        "description", "사용자가 시청하고 평점을 남긴 영화 목록을 조회합니다."
                ),
                Map.of(
                        "name", "recommend_movies",
                        "description", "사용자의 시청 기록과 평점을 분석해 개인화된 영화 추천 목록을 반환합니다."
                ),
                Map.of(
                        "name", "search_movies",
                        "description", "영화 제목으로 TMDB에서 영화를 검색합니다.",
                        "parameters", Map.of(
                                "type", "OBJECT",
                                "properties", Map.of(
                                        "query", Map.of("type", "STRING", "description", "검색할 영화 제목")
                                ),
                                "required", List.of("query")
                        )
                )
        );
    }
}