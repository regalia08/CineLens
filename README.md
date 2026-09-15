# CineLens

개인 영화 취향 분석 및 맞춤형 영화 추천 웹 애플리케이션

> React + TypeScript 학습 및 포트폴리오 목적으로 진행 중인 프로젝트입니다.

## 소개

CineLens는 사용자가 시청한 영화와 개인 평점을 기반으로 영화 취향을 분석하고, 아직 보지 않은 영화 중 취향에 맞는 작품을 추천하는 개인화 영화 추천 웹 애플리케이션입니다.

사용자는 영화를 검색해 시청 기록으로 등록하고 개인 평점을 남길 수 있으며, 서비스는 이 데이터를 분석해 선호 장르·감독을 파악하고 맞춤형 추천을 제공합니다.

MCP(Model Context Protocol) 서버를 통해 Claude 등 LLM 클라이언트에서 시청 기록 조회, 개인화 추천, 영화 검색, 시청 기록 등록/수정/삭제까지 자연어로 요청할 수 있습니다.

웹앱 자체에도 채팅 페이지를 두어, Gemini API(Function Calling)를 통해 로그인 없이 바로 자연어로 시청 기록 조회·추천·검색을 요청할 수 있습니다. LLM 프로바이더를 교체할 수 있도록 `LlmService` 인터페이스로 추상화했습니다.

## 기술 스택

| 구분 | 기술 |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Spring Boot, Java |
| Database | MySQL, Spring Data JPA |
| External API | TMDB (The Movie Database) |
| 사용자 식별 | 익명 UUID (localStorage 기반) |
| AI/LLM | MCP 서버 (Python, FastMCP) + Claude Desktop / 인앱 챗봇 (Gemini API, Function Calling) |
| 멀티 LLM 확장 | `LlmService` 인터페이스로 프로바이더 추상화 (Claude 등 추가 예정) |

## 프로젝트 구조

```
CineLens/
├── frontend/           # React + TypeScript (Vite)
│   └── src/
│       ├── pages/      # 페이지 컴포넌트 (Home, Search, MovieDetail, MyPage, Recommendation, Chat)
│       ├── components/ # 재사용 컴포넌트 (MovieCard, StarRating)
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
└── mcp-server/         # MCP 서버 (Python)
    └── server.py       # 도구 정의 (조회 4개 + CRUD 3개)
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

### MCP 연동

기존 REST API(시청 기록 CRUD, 추천)를 새로 개발하지 않고 그대로 감싸는 방식으로 MCP 서버를 구현했습니다. Python(FastMCP, mcp&lt;2)으로 작성했으며 Claude Desktop과 연결해 자연어로 서비스를 조작할 수 있습니다.

제공 도구 7개:
- `get_watched_movies` — 시청 기록 조회
- `recommend_movies` — 개인화 추천 조회
- `search_movies` — TMDB 영화 검색
- `get_popular_movies` — TMDB 인기 영화 조회
- `add_watched_movie` / `update_rating` / `delete_watched_movie` — 시청 기록 등록/수정/삭제

현재는 테스트용 고정 UUID를 사용하며, 추후 호출 시점에 사용자 UUID를 파라미터로 받는 방식으로 확장 가능합니다.

### 인앱 챗봇 (자연어 영화 추천)

MCP가 Claude Desktop 등 외부 클라이언트 전용이라는 한계를 보완하기 위해, 웹앱 자체에 채팅 페이지(`/chat`)를 추가했습니다. 백엔드에 `LlmService` 인터페이스를 두고 `GeminiService`로 구현했으며, Gemini의 Function Calling으로 아래 도구를 호출합니다.

- `get_watched_movies` — 시청 기록 조회 (TMDB 상세정보와 병합해 영화 제목까지 포함해 반환)
- `recommend_movies` — 개인화 추천 조회
- `search_movies` — TMDB 영화 검색
- `add_watched_movie` / `update_rating` / `delete_watched_movie` — 시청 기록 등록/수정/삭제 (MCP와 동일한 기능 제공)

도구 호출 → 실행 → 결과를 다시 LLM에 전달 → 최종 답변까지 여러 턴을 오가는 에이전틱 루프로 구현했으며, `LlmService` 인터페이스 덕분에 추후 Claude 등 다른 프로바이더를 구현체만 추가해 확장할 수 있습니다.

### UI/스타일링

Tailwind CSS로 넷플릭스 스타일(다크 배경 + 포스터 중심)의 일관된 디자인을 적용했습니다. 여러 페이지에서 반복되는 영화 카드 UI를 `MovieCard` 컴포넌트로 분리해 재사용했으며(홈/검색/마이페이지/추천 페이지에서 공통 사용), 평점은 클릭형 별점 컴포넌트(`StarRating` — 마우스 위치 기반 0.5 단위 실시간 미리보기)로 입력하고, 이미 매긴 평점은 읽기 전용 컴포넌트(`StarDisplay` — lucide-react SVG 아이콘 기반)로 표시합니다.

로딩 상태는 공용 `Spinner` 컴포넌트로 통일했으며(영화 상세 이미지, 마이페이지, 추천 페이지), 이미지 로딩 중에는 스켈레톤에서 페이드인 전환됩니다. 그리드 레이아웃은 반응형(`grid-cols-2` → `sm:3` → `md:5`)으로 화면 크기에 따라 열 개수가 조정됩니다.

챗봇 페이지는 말풍선 UI(사용자/AI 메시지 좌우 구분)로 구성했으며, 대화 기록은 `localStorage`에 저장해 새로고침 후에도 유지되고, 새 메시지 수신 시 자동으로 스크롤이 하단으로 이동합니다.

## 진행 현황

### Frontend
- [x] Vite + React + TypeScript 프로젝트 세팅
- [x] React Router 기반 라우팅 (`/`, `/search`, `/movie/:id`, `/mypage`, `/recomm`)
- [x] 익명 사용자 ID 로직 (UUID + localStorage)
- [x] 인기 영화 목록 (홈)
- [x] 영화 검색 (입력, 버튼, 엔터키)
- [x] 영화 상세 페이지
- [x] 공통 API 요청 함수 (`apiRequest` — `X-User-Id` 헤더 자동 첨부)
- [x] 시청 기록 등록 (상세 페이지에서 "봤어요" + 평점 입력)
- [x] 내가 본 영화 목록 (마이페이지 — 포스터 그리드, 클릭 시 상세 이동)
- [x] 시청 기록 평점 수정 (상세 페이지 진입 시 기존 평점 자동 로드)
- [x] 시청 기록 삭제 (마이페이지, 확인창 포함)
- [x] 정렬 (마이페이지 — 평점 오름차순/내림차순)
- [x] 장르 필터 (홈 — 체크박스, TMDB 장르 목록 API 연동)
- [x] 추천 결과 UI (추천 페이지 — 로딩/빈 상태 처리, 추천 이유 표시)
- [x] 인앱 채팅 UI (`/chat` — 대화 기록 렌더링, 전송/엔터 처리, localStorage 저장, 자동 스크롤)
- [x] Tailwind CSS 스타일링 (전 페이지 — 넷플릭스 스타일 다크 테마, 반응형 그리드)
- [x] MovieCard / StarRating / StarDisplay / Spinner 재사용 컴포넌트 분리

### Backend
- [x] Spring Boot + MySQL + JPA 프로젝트 세팅
- [x] 시청 기록 테이블 설계 (`watched_movies`)
- [x] 시청 기록 등록/조회/수정/삭제 API
- [x] 익명 사용자 ID 헤더(`X-User-Id`) 기반 처리
- [x] CORS 설정
- [x] 프론트엔드 연동 확인 (등록/조회/수정/삭제)
- [x] 취향 분석 로직 (선호 장르/감독 분석, 시청기록 가중 평균 기반)
- [x] 추천 로직 (가중치 기반 점수 계산 — 장르 40%+감독 30%+평점 20%+유사도 10%, 2단계 계산으로 TMDB 호출 최적화)
- [x] 인앱 챗봇 (`LlmService` 인터페이스 + `GeminiService`, Function Calling 에이전틱 루프, `/api/chat`)
- [ ] TMDB 프록시 API (현재 프론트는 TMDB 직접 호출 중, 추천/챗봇 API는 백엔드 경유로 구현됨)

### 확장 (선택)
- [x] MCP 연동 (조회 4개 + CRUD 3개 도구, Claude Desktop 연결 확인)
- [x] 인앱 자연어 추천 챗봇 (Gemini Function Calling)
- [ ] 취향 분석 차트
- [ ] 멀티 LLM 프로바이더 추가 (Claude 등, `LlmService` 구현체 확장)
- [ ] Docker 구성 (마감 이후 별도 작업 예정)

## API

### 시청 기록 (`/api/watched-movies`)

모든 요청은 `X-User-Id` 헤더(익명 사용자 UUID)가 필요합니다.

| Method | Endpoint | 설명 | 프론트 연동 |
|---|---|---|---|
| POST | `/api/watched-movies` | 시청 기록 등록 (또는 평점 갱신) | ✅ 완료 |
| GET | `/api/watched-movies` | 내가 본 영화 목록 조회 | ✅ 완료 |
| PUT | `/api/watched-movies/{movieId}` | 평점 수정 (현재는 POST 재호출로 처리) | — |
| DELETE | `/api/watched-movies/{movieId}` | 시청 기록 삭제 | ✅ 완료 |

### 추천 (`/api/recommendations`)

| Method | Endpoint | 설명 | 프론트 연동 |
|---|---|---|---|
| GET | `/api/recommendations` | 시청 기록 기반 개인화 영화 추천 (상위 10개, 추천 이유 포함) | ✅ 완료 |

### 챗봇 (`/api/chat`)

| Method | Endpoint | 설명 | 프론트 연동 |
|---|---|---|---|
| POST | `/api/chat` | 자연어 메시지로 시청기록 조회/추천/검색 요청 (Gemini Function Calling) | ✅ 완료 |

## 개발 일정

| 기간 | 목표 | 상태 |
|---|---|---|
| 8/19 ~ 8/26 | React/TS 기초 설계, 영화 탐색 기능 | 완료 |
| 8/27 ~ 9/2 | Spring Boot + DB 연동 | 완료 |
| 9/3 ~ 9/4 | 프론트-백엔드 연동, 마이페이지 (조회/등록/수정/삭제) | 완료 |
| 9/8 ~ 9/9 | 정렬/필터, 추천 시스템 (백엔드 로직 + 프론트 연동) | 완료 |
| 9/11 | MCP 서버 구현 및 Claude Desktop 연동 | 완료 |
| 9/14 | 인앱 챗봇 (Gemini Function Calling, 백엔드+프론트) | 완료 |
| 9/14 | 버그 점검 (존재하지 않는 영화 등록 방지, 챗봇 race condition, API 실패 처리, 429 대응) | 완료 |
| 9/14 | Tailwind 스타일링 (전 페이지, MovieCard/StarRating 컴포넌트 분리) | 완료 |
| 9/15 | 세부 점검 (시드 데이터 확장, 챗봇 CRUD 도구 추가, 상세페이지 UI 개선, 반응형, 로딩 스피너 통일) | 완료 |
| 9/16 ~ 9/17 | README 정리 | 예정 |
| 9/18 | 최종 점검, 마감 | 예정 |

**최종 마감: 2026년 9월 18일**

## 로컬 실행 방법

### Backend

1. MySQL에 스키마 생성
   ```sql
   CREATE DATABASE cinelens CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. `backend/src/main/resources/application-local.properties` 생성 후 DB 비밀번호, TMDB API 키, Gemini API 키 설정
   ```properties
   spring.datasource.password=your_password
   tmdb.api.key=your_tmdb_api_key
   gemini.api.key=your_gemini_api_key
   llm.provider=gemini
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

### MCP 서버 (선택)

1. 가상환경 세팅 및 라이브러리 설치
   ```bash
   cd mcp-server
   python -m venv venv
   venv\Scripts\activate
   pip install "mcp<2" requests
   ```
2. `server.py` 상단의 `TMDB_API_KEY`, `TEST_USER_ID`를 실제 값으로 설정
3. Claude Desktop 설정 파일(`claude_desktop_config.json`)의 `mcpServers`에 아래 항목 추가 후 재시작
   ```json
   "cinelens": {
     "command": "<프로젝트경로>/mcp-server/venv/Scripts/python.exe",
     "args": ["<프로젝트경로>/mcp-server/server.py"]
   }
   ```
4. Spring Boot 백엔드가 켜진 상태에서 Claude Desktop에 자연어로 요청 (예: "내가 본 영화 목록 보여줘")
