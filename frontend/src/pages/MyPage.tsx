import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import { Link } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = 'https://api.themoviedb.org/3/movie';




function MyPage() {

  const [moviList, setMovieList] = useState<any>([]);

  useEffect(() => {
    getMovieList();
    }, []);

  async function getMovieList() {
  const watchedList = await apiRequest('/api/watched-movies');

  const posterList = await Promise.all(
    watchedList.map((item) =>
      fetch(`${API_URL}/${item.movieId}?api_key=${API_KEY}&language=ko-KR`)
        .then((res) => res.json())
    )
  );

  console.log(posterList);
  setMovieList(posterList);
}


  return (
    <div>
      <div>
        {moviList.map((movie) => {
          const imageUrl = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
          return(
          <Link to={`/movie/${movie.id}`} key={movie.id}>
            <div>
              <img src={imageUrl} alt={movie.title} /><br />
            </div>
          </Link>
          );
        })}
      </div>
    </div>
  );
}

export default MyPage;