CREATE TABLE IF NOT EXISTS watched_movies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    movie_id INT NOT NULL,
    rating DOUBLE,
    watched_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_movie (user_id, movie_id)
);

INSERT INTO watched_movies (user_id, movie_id, rating, watched_at) VALUES
('ff74d04c-876b-4b2e-87dc-df9d5ffbc634', 27205, 5.0, NOW()),   -- 인셉션
('ff74d04c-876b-4b2e-87dc-df9d5ffbc634', 13, 5.0, NOW()),       -- 포레스트 검프
('ff74d04c-876b-4b2e-87dc-df9d5ffbc634', 1726, 4.5, NOW()),     -- 아이언맨
('ff74d04c-876b-4b2e-87dc-df9d5ffbc634', 37165, 4.5, NOW()),    -- 트루먼 쇼
('ff74d04c-876b-4b2e-87dc-df9d5ffbc634', 299534, 4.0, NOW()),   -- 어벤져스: 엔드게임
('ff74d04c-876b-4b2e-87dc-df9d5ffbc634', 10138, 3.0, NOW()),    -- 아이언맨 2
('ff74d04c-876b-4b2e-87dc-df9d5ffbc634', 68721, 4.0, NOW()),    -- 아이언맨 3
('ff74d04c-876b-4b2e-87dc-df9d5ffbc634', 100402, 4.5, NOW()),   -- 캡틴 아메리카: 윈터 솔져
('ff74d04c-876b-4b2e-87dc-df9d5ffbc634', 24428, 4.0, NOW()),    -- 어벤져스
('ff74d04c-876b-4b2e-87dc-df9d5ffbc634', 99861, 4.0, NOW()),    -- 어벤져스: 에이지 오브 울트론
('ff74d04c-876b-4b2e-87dc-df9d5ffbc634', 271110, 4.5, NOW()),   -- 캡틴 아메리카: 시빌 워
('ff74d04c-876b-4b2e-87dc-df9d5ffbc634', 315635, 3.5, NOW()),   -- 스파이더맨: 홈커밍
('ff74d04c-876b-4b2e-87dc-df9d5ffbc634', 284053, 3.5, NOW()),   -- 토르: 라그나로크
('ff74d04c-876b-4b2e-87dc-df9d5ffbc634', 284054, 3.0, NOW()),   -- 블랙 팬서
('ff74d04c-876b-4b2e-87dc-df9d5ffbc634', 299536, 4.0, NOW()),   -- 어벤져스: 인피니티 워
('ff74d04c-876b-4b2e-87dc-df9d5ffbc634', 1427318, 4.0, NOW()),  -- 우마무스메 프리티더비: Road to the Top
('ff74d04c-876b-4b2e-87dc-df9d5ffbc634', 1223178, 4.5, NOW());  -- 우마무스메 프리티더비: 새로운 시대의 문