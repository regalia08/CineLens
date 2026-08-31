import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = 'https://api.themoviedb.org/3/movie/';

function HomePage() {
  const [Movies, setMovies] = useState([]); // 빈배열 저장해두기
  //console.log('Movies : ', Movies);

  useEffect(() => {
    const endpoint = `${API_URL}popular?api_key=${API_KEY}&language=ko-KR`
    // console.log(endpoint);

    fetch(endpoint)
      .then(response => response.json())
      .then(response => setMovies(response.results));
  }, []);

  return (
    
    <div className="movie-list">
      {Movies.map((movie) => {
        const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        return(
        <div key={movie.id}>
          title={movie.title}<br />
          <img src={imageUrl} alt={movie.title} /><br />
          overview={movie.overview}<br /><br />
        </div>
      );
    })}
    </div>
  );
}

export default HomePage;