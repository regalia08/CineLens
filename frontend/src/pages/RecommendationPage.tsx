import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

function RecommendationPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getRecommendations() {
      setIsLoading(true);
      const result = await apiRequest('/api/recommendations');
      setRecommendations(result);
      setIsLoading(false);
    }
    getRecommendations();
  }, []);

  if (isLoading) {
    return <div>추천 영화를 분석하는 중입니다...</div>;
  }

  if (recommendations.length === 0) {
    return <div>아직 추천할 영화가 없어요. 영화를 몇 편 시청 등록해보세요!</div>;
  }

  return (
    <div>
      <h1>당신을 위한 추천 영화</h1>
      <div className="recommendation-list">
        {recommendations.map((movie) => {
          const imageUrl = `https://image.tmdb.org/t/p/w300${movie.posterPath}`;
          return (
            <Link to={`/movie/${movie.movieId}`} key={movie.movieId}>
              <div>
                <img src={imageUrl} alt={movie.title} /><br />
                <strong>{movie.title}</strong><br />
                <span>{movie.reason}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default RecommendationPage;