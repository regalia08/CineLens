# CineLens

개인 영화 취향 분석 및 맞춤형 영화 추천 웹 애플리케이션

> React + TypeScript 학습 및 포트폴리오 목적으로 진행 중인 프로젝트입니다.

## 소개

CineLens는 사용자가 시청한 영화와 개인 평점을 기반으로 영화 취향을 분석하고, 아직 보지 않은 영화 중 취향에 맞는 작품을 추천하는 개인화 영화 추천 웹 애플리케이션입니다.

사용자는 영화를 검색해 시청 기록으로 등록하고 개인 평점을 남길 수 있으며, 서비스는 이 데이터를 분석해 선호 장르·감독을 파악하고 맞춤형 추천을 제공합니다.

추후 MCP(Model Context Protocol)와 LLM을 연동해, 자연어로 추천 조건을 입력하면 AI가 사용자의 취향과 요청을 종합 분석해 영화를 추천하는 기능으로 확장할 예정입니다.

## 기술 스택

| 구분 | 기술 |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Spring Boot, Java |
| Database | MySQL, Spring Data JPA |
| External API | TMDB (The Movie Database) |
| 사용자 식별 | 익명 UUID (localStorage 기반) |
| AI/LLM (확장 예정) | MCP, 로컬 LLM |

## 프로젝트 구조

```
CineLens/
├── frontend/           # React + TypeScript (Vite)
│   └── src/
│       ├── pages/      # 페이지 컴포넌트 (Home, Search, MovieDetail, MyPage)
│       ├── utils/       # 유틸 함수 (익명 사용자 ID 등)
│       └── App.tsx      # 공통 레이아웃 (네비게이션 + Outlet)
└── backend/            # Spring Boot
    └── src/main/java/com/cinelens/backend/
        ├── entity/       # JPA 엔티티
        ├── repository/   # Spring Data JPA Repository
        ├── service/      # 비즈니스 로직
        ├── controller/    # REST API
        ├── dto/          # 요청/응답 DTO
        └── config/       # CORS 등 설정
```

## 주요 설계

### 사용자 식별 방식

로그인 없이 사용자를 구분하기 위해 브라우저에 UUID를 생성해 `localStorage`에 저장하고, 모든 API 요청에 `X-User-Id` 헤더로 실어 보내는 방식을 사용합니다. 추후 로그인 기능을 추가할 경우 이 자리를 실제 인증 정보로 대체할 수 있도록 설계했습니다.

### API 프록시 원칙

프론트엔드는 TMDB API를 직접 호출하지 않고, 백엔드(Spring Boot)를 경유하도록 설계합니다. (API 키 보호 및 응답 스펙 일원화 목적 — 프론트 개발 초기 단계에서는 학습 편의상 임시로 직접 호출하며 점진적으로 전환 예정)

### 추천 점수 계산

```
추천 점수 = (장르 선호도 × 0.4)
          + (선호 감독 일치 × 0.3)
          + (사용자 평점 정규화 × 0.2)
          + (유사 영화 여부 × 0.1)
```

사용자의 시청 기록과 평점 데이터를 기반으로 장르/감독 선호도를 분석하고, 이미 시청한 영화를 제외한 후보 영화에 위 가중치를 적용해 추천 점수를 계산합니다.

## 진행 현황

### Frontend
- [x] Vite + React + TypeScript 프로젝트 세팅
- [x] React Router 기반 라우팅 (`/`, `/search`, `/movie/:id`, `/mypage`)
- [x] 익명 사용자 ID 로직 (UUID + localStorage)
- [x] 인기 영화 목록 (홈)
- [x] 영화 검색 (입력, 버튼, 엔터키)
- [x] 영화 상세 페이지
- [x] 공통 API 요청 함수 (`apiRequest` — `X-User-Id` 헤더 자동 첨부)
- [x] 시청 기록 등록 (상세 페이지에서 "봤어요" + 평점 입력)
- [x] 내가 본 영화 목록 (마이페이지 — 포스터 그리드, 클릭 시 상세 이동)
- [ ] 시청 기록 평점 수정 (상세 페이지에서 기존 평점 불러오기)
- [ ] 시청 기록 삭제
- [ ] 정렬 및 필터 (평점순, 장르별)
- [ ] 추천 결과 UI

### Backend
- [x] Spring Boot + MySQL + JPA 프로젝트 세팅
- [x] 시청 기록 테이블 설계 (`watched_movies`)
- [x] 시청 기록 등록/조회/수정/삭제 API
- [x] 익명 사용자 ID 헤더(`X-User-Id`) 기반 처리
- [x] CORS 설정
- [x] 프론트엔드 연동 확인 (등록/조회)
- [ ] TMDB 프록시 API
- [ ] 취향 분석 로직 (선호 장르/감독 분석)
- [ ] 추천 로직 (가중치 기반 점수 계산)

### 확장 (선택)
- [ ] 취향 분석 차트
- [ ] MCP 연동
- [ ] 로컬 LLM 기반 자연어 추천

## API

### 시청 기록 (`/api/watched-movies`)

모든 요청은 `X-User-Id` 헤더(익명 사용자 UUID)가 필요합니다.

| Method | Endpoint | 설명 | 프론트 연동 |
|---|---|---|---|
| POST | `/api/watched-movies` | 시청 기록 등록 (또는 평점 갱신) | ✅ 완료 |
| GET | `/api/watched-movies` | 내가 본 영화 목록 조회 | ✅ 완료 |
| PUT | `/api/watched-movies/{movieId}` | 평점 수정 | ⬜ 예정 |
| DELETE | `/api/watched-movies/{movieId}` | 시청 기록 삭제 | ⬜ 예정 |

## 개발 일정

| 기간 | 목표 | 상태 |
|---|---|---|
| 8/19 ~ 8/26 | React/TS 기초 설계, 영화 탐색 기능 | 완료 |
| 8/27 ~ 9/2 | Spring Boot + DB 연동 | 완료 |
| 9/3 ~ 9/4 | 프론트-백엔드 연동, 마이페이지 (조회/등록) | 진행 중 |
| 9/8 ~ 9/12 | 마이페이지 마무리 (수정/삭제/정렬), 추천 시스템 | 예정 |
| 9/13 ~ 9/16 | 스타일링, 버그 수정, 선택 기능(MCP 등) | 예정 |
| 9/17 ~ 9/18 | 배포, README 정리, 최종 점검 | 예정 |

**최종 마감: 2026년 9월 18일**

## 로컬 실행 방법

### Backend

1. MySQL에 스키마 생성
   ```sql
   CREATE DATABASE cinelens CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. `backend/src/main/resources/application-local.properties` 생성 후 DB 비밀번호 설정
   ```properties
   spring.datasource.password=your_password
   ```
3. 프로젝트 실행 (Spring Boot 서버는 `8080` 포트에서 구동)

### Frontend

1. `frontend/.env` 생성 후 TMDB API 키 설정
   ```
   VITE_TMDB_API_KEY=your_tmdb_api_key
   ```
2. 의존성 설치 및 실행
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. `http://localhost:5173` 접속
