import requests
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("CineLens")

BACKEND_URL = "http://localhost:8080"
TMDB_API_KEY = "b196f99f5f6642dd9670f563036be138"
TMDB_URL = "https://api.themoviedb.org/3"

# 지금은 테스트용 고정 UUID. 나중에 사용자별로 바꾸고 싶으면
# 이 상수를 각 함수의 파라미터로 옮기면 됨.
TEST_USER_ID = "ff74d04c-876b-4b2e-87dc-df9d5ffbc634"


def _headers():
    return {"X-User-Id": TEST_USER_ID}


@mcp.tool()
def get_watched_movies() -> list:
    """사용자가 시청하고 평점을 남긴 영화 목록을 조회합니다."""
    res = requests.get(f"{BACKEND_URL}/api/watched-movies", headers=_headers())
    res.raise_for_status()
    return res.json()


@mcp.tool()
def recommend_movies() -> list:
    """사용자의 시청 기록과 평점을 분석해 개인화된 영화 추천 목록을 반환합니다.
    각 결과는 movieId, title, posterPath, score, reason(추천 이유)을 포함합니다."""
    res = requests.get(f"{BACKEND_URL}/api/recommendations", headers=_headers())
    res.raise_for_status()
    return res.json()


@mcp.tool()
def search_movies(query: str) -> list:
    """영화 제목으로 TMDB에서 영화를 검색합니다."""
    res = requests.get(
        f"{TMDB_URL}/search/movie",
        params={"api_key": TMDB_API_KEY, "query": query, "language": "ko-KR"},
    )
    res.raise_for_status()
    return res.json().get("results", [])


@mcp.tool()
def add_watched_movie(movie_id: int, rating: float) -> dict:
    """영화를 시청 기록에 등록하고 평점을 저장합니다.
    movie_id는 TMDB 영화 ID, rating은 0~5 사이의 평점입니다."""
    res = requests.post(
        f"{BACKEND_URL}/api/watched-movies",
        headers=_headers(),
        json={"movieId": movie_id, "rating": rating},
    )
    res.raise_for_status()
    return res.json()


@mcp.tool()
def update_rating(movie_id: int, rating: float) -> dict:
    """이미 시청 기록에 등록된 영화의 평점을 수정합니다.
    movie_id는 TMDB 영화 ID, rating은 0~5 사이의 새 평점입니다."""
    res = requests.put(
        f"{BACKEND_URL}/api/watched-movies/{movie_id}",
        headers=_headers(),
        json={"rating": rating},
    )
    res.raise_for_status()
    return res.json()


@mcp.tool()
def delete_watched_movie(movie_id: int) -> dict:
    """시청 기록에서 영화를 삭제합니다. movie_id는 TMDB 영화 ID입니다."""
    res = requests.delete(
        f"{BACKEND_URL}/api/watched-movies/{movie_id}",
        headers=_headers(),
    )
    res.raise_for_status()
    return {"deleted": True, "movieId": movie_id}


@mcp.tool()
def get_popular_movies(limit: int = 5) -> list:
    """현재 TMDB 기준 인기 영화 목록을 반환합니다. limit으로 개수를 지정할 수 있습니다."""
    res = requests.get(
        f"{TMDB_URL}/movie/popular",
        params={"api_key": TMDB_API_KEY, "language": "ko-KR"},
    )
    res.raise_for_status()
    results = res.json().get("results", [])
    return results[:limit]


if __name__ == "__main__":
    mcp.run()