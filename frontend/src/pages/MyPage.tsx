import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import MovieCard from "../components/MovieCard";


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = 'https://api.themoviedb.org/3/movie';




function MyPage() {

  const [moviList, setMovieList] = useState<any>([]);

  useEffect(() => {
    getMovieList();


  }, []);

  async function getMovieList() {
    const watchedList = await apiRequest('/api/watched-movies');

    const mergedList = await Promise.all(
      watchedList.map(async (item) => {
        const tmdbData = await fetch(`${API_URL}/${item.movieId}?api_key=${API_KEY}&language=ko-KR`)
          .then((res) => res.json());
        return { ...tmdbData, rating: item.rating };
      })
    );

    setMovieList(mergedList);
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
      <div className="grid grid-cols-5 gap-4">
        {moviList.map((movie) => (
          <MovieCard
            key={movie.id}
            movieId={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            subtitle={`⭐ ${movie.rating}`}
            onDelete={() => delView(movie.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default MyPage;