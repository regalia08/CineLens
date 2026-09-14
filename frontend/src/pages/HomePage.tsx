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
      {genres.map((genre) => {
        return (
          <div key={genre.id}>
            <input
              type='checkbox'
              id={genre.name}
              onChange={(e) => handleGenreCheck(genre.id, e.target.checked)}
            /><label htmlFor={genre.name} className="text-red-500">{genre.name}</label>
          </div>

        );
      })}
      <div className="flex flex-wrap gap-4">
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