import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = 'https://api.themoviedb.org/3/movie/';

function HomePage() {
  const [Movies, setMovies] = useState([]); // 빈배열 저장해두기
  const [genres, setGenres] = useState<any[]>([]);
  const [chkGenres, setChkGenres] = useState<number[]>([]);
  //console.log('Movies : ', Movies);

  useEffect(() => {
    const endpoint = `${API_URL}popular?api_key=${API_KEY}&language=ko-KR`
    // console.log(endpoint);

    fetch(endpoint)
      .then(response => response.json())
      .then(response => setMovies(response.results));
  }, []);

  useEffect(() => {
    const endpoint = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=ko-KR`;

    fetch(endpoint)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setGenres(response.genres);
      });
  }, []);

  const handleGenreCheck = (genreId: number, checked: boolean) => {
    if (checked) {
      setChkGenres((prev) => [...prev, genreId]);
    } else {
      setChkGenres(chkGenres.filter((el) => el !== genreId));
    }
  };

  const filteredMovies = Movies.filter((movie) => {
    if (chkGenres.length === 0) return true; // 선택 없으면 전체 보여줌
    return movie.genre_ids.some((id) =>
      chkGenres.includes(id)
    );
  });

  useEffect(() => {
    console.log(chkGenres);
  }, [chkGenres]);

  return (

    <div className="movie-list">
      <div className="flex flex-wrap gap-2 mb-6">
        {genres.map((genre) => {
          const isChecked = chkGenres.includes(genre.id);
          return (
            <button
              key={genre.id}
              onClick={() => handleGenreCheck(genre.id, !isChecked)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${isChecked
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
            >
              {genre.name}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {filteredMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movieId={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;