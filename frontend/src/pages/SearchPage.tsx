import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiRequest } from "../utils/api";
import MovieCard from "../components/MovieCard";
import Spinner from "../components/Spinner";


function SearchPage() {
  const [strSearch, setStrSearch] = useState<string>('');
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_URL = 'https://api.themoviedb.org/3/search/movie';
  const [Result, setSearchResult] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [watchedMap, setWatchedMap] = useState<Record<number, number>>({});
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    async function loadWatched() {
      const watchedList = await apiRequest('/api/watched-movies');
      const map: Record<number, number> = {};
      watchedList.forEach((item: any) => {
        map[item.movieId] = item.rating;
      });
      setWatchedMap(map);
    }
    loadWatched();
  }, []);

  const searchTxt = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStrSearch(event.target.value);
    //console.log(event.target.value);
  };

  const runSearch = (query: string) => {
    setSearchParams({ q: query });
    setIsSearching(true);
    const endpoint = `${API_URL}?api_key=${API_KEY}&query=${query}&language=ko-KR`
    fetch(endpoint)
      .then(response => response.json())
      .then(response => {
        setSearchResult(response.results);
        setIsSearching(false);
      });
  }

  const searchResult = (event: React.MouseEvent<HTMLButtonElement>) => {
    runSearch(strSearch);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runSearch(strSearch);
    }
  }

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setStrSearch(q);
      runSearch(q);
    }
  }, []);

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
          type="text"
          placeholder="검색할 영화를 입력하세요"
          value={strSearch}
          onChange={searchTxt}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={searchResult}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-medium transition-colors"
        >
          검색
        </button>
      </div>

      {isSearching ? (
        <div className="flex flex-col items-center gap-4 mt-20">
          <Spinner />
          <p className="text-zinc-400">검색 중이에요...</p>
        </div>
      ) : Result.length === 0 ? (
        strSearch.trim() !== '' && (
          <div className="text-center text-zinc-400 mt-20">
            검색 결과가 없어요.
          </div>
        )
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Result.map((movie) => (
            <MovieCard
              key={movie.id}
              movieId={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              rating={watchedMap[movie.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;