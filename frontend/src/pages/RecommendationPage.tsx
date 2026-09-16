import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import MovieCard from "../components/MovieCard";
import Spinner from "../components/Spinner";

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
    return (
      <div className="flex flex-col items-center gap-4 mt-20">
        <Spinner />
        <p className="text-zinc-400">취향을 분석하고 있어요</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center text-zinc-400 mt-20">
        아직 추천할 영화가 없어요. 영화를 몇 편 시청 등록해보세요!
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">당신을 위한 추천 영화</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {recommendations.map((movie) => (
          <MovieCard
            key={movie.movieId}
            movieId={movie.movieId}
            title={movie.title}
            posterPath={movie.posterPath}
            subtitle={movie.reason}
          />
        ))}
      </div>
    </div>
  );
}

export default RecommendationPage;