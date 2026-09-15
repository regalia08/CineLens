import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import MovieCard from "../components/MovieCard";
import Spinner from "../components/Spinner";


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = 'https://api.themoviedb.org/3/movie';




function MyPage() {

  const [moviList, setMovieList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {
    getMovieList();


  }, []);

  async function getMovieList() {
    setIsLoading(true);

    const watchedList = await apiRequest('/api/watched-movies');

    const mergedList = await Promise.all(
      watchedList.map(async (item) => {
        const tmdbData = await fetch(`${API_URL}/${item.movieId}?api_key=${API_KEY}&language=ko-KR`)
          .then((res) => res.json());
        return { ...tmdbData, rating: item.rating };
      })
    );

    setMovieList(mergedList);
    setIsLoading(false);
  }

  async function delView(movieId: number) {
    const isConfirmed = confirm("정말 삭제하시겠습니까?");
    if (!isConfirmed) {
      return; // 취소하면 여기서 함수 종료, 삭제 안 함
    }
    const result = await apiRequest(`/api/watched-movies/${movieId}`, {
      method: 'DELETE'
    });
    //console.log(result);
    location.reload();

  }

  const handleSortAsc = () => {
    const sorted = [...moviList].sort((a, b) => a.rating - b.rating);
    setMovieList(sorted);
  };

  const handleSortDesc = () => {
    const sorted = [...moviList].sort((a, b) => b.rating - a.rating);
    setMovieList(sorted);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          onClick={handleSortAsc}
          className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm transition-colors"
        >
          평점 오름차순
        </button>
        <button
          onClick={handleSortDesc}
          className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm transition-colors"
        >
          평점 내림차순
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {moviList.map((movie) => (
          <MovieCard
            key={movie.id}
            movieId={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            rating={movie.rating}
            onDelete={() => delView(movie.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default MyPage;