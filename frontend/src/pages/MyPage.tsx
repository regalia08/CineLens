import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import MovieCard from "../components/MovieCard";
import Spinner from "../components/Spinner";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = 'https://api.themoviedb.org/3/movie';

function MyPage() {
  const [moviList, setMovieList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortType, setSortType] = useState<string>('기본순');

  useEffect(() => {
    getMovieList();
  }, []);

  async function getMovieList() {
    setIsLoading(true);

    const watchedList = await apiRequest('/api/watched-movies');

    const mergedList = await Promise.all(
      watchedList.map(async (item: any) => {
        const tmdbData = await fetch(`${API_URL}/${item.movieId}?api_key=${API_KEY}&language=ko-KR`)
          .then((res) => res.json());
        return { ...tmdbData, rating: item.rating, watchedAt: item.watchedAt };
      })
    );

    setMovieList(mergedList);
    setIsLoading(false);
  }

  async function delView(movieId: number) {
    const isConfirmed = confirm("정말 삭제하시겠습니까?");
    if (!isConfirmed) {
      return;
    }
    await apiRequest(`/api/watched-movies/${movieId}`, {
      method: 'DELETE'
    });
    location.reload();
  }

  const handleSortAsc = () => {
    const sorted = [...moviList].sort((a, b) => a.rating - b.rating);
    setMovieList(sorted);
    setSortType('평점 낮은순');
  };

  const handleSortDesc = () => {
    const sorted = [...moviList].sort((a, b) => b.rating - a.rating);
    setMovieList(sorted);
    setSortType('평점 높은순');
  };

  const handleSortByDateAsc = () => {
    const sorted = [...moviList].sort((a, b) => new Date(a.watchedAt).getTime() - new Date(b.watchedAt).getTime());
    setMovieList(sorted);
    setSortType('오래된순');
  };

  const handleSortByDateDesc = () => {
    const sorted = [...moviList].sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());
    setMovieList(sorted);
    setSortType('최신순');
  };

  const handleSortByTitle = () => {
    const sorted = [...moviList].sort((a, b) => a.title.localeCompare(b.title, 'ko'));
    setMovieList(sorted);
    setSortType('이름순');
  };

  const handleSortByTitleDesc = () => {
    const sorted = [...moviList].sort((a, b) => b.title.localeCompare(a.title, 'ko'));
    setMovieList(sorted);
    setSortType('이름 역순');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 mt-20">
        <Spinner />
        <p className="text-zinc-400">내가 본 영화를 불러오고 있어요...</p>
      </div>
    );
  }

  if (moviList.length === 0) {
    return (
      <div className="text-center text-zinc-400 mt-20">
        아직 시청 기록이 없어요. 영화를 검색해서 "봤어요"를 등록해보세요!
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center flex-wrap gap-2 mb-6">
        <button onClick={handleSortDesc} className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm transition-colors">
          평점 높은순
        </button>
        <button onClick={handleSortAsc} className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm transition-colors">
          평점 낮은순
        </button>
        <button onClick={handleSortByDateDesc} className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm transition-colors">
          최신순
        </button>
        <button onClick={handleSortByDateAsc} className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm transition-colors">
          오래된순
        </button>
        <button onClick={handleSortByTitle} className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm transition-colors">
          이름순
        </button>
        <button onClick={handleSortByTitleDesc} className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm transition-colors">
          이름 역순
        </button>
        <span className="text-zinc-500 text-sm ml-2">정렬: {sortType}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {moviList.map((movie: any) => (
          <MovieCard
            key={movie.id}
            movieId={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            rating={movie.rating}
            subtitle={new Date(movie.watchedAt).toLocaleDateString('ko-KR')}
            onDelete={() => delView(movie.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default MyPage;