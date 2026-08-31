import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = 'https://api.themoviedb.org/3/movie';



function MovieDetailPage() {
  const params = useParams();
  const [movieDetail, setMovieDetail] = useState<any>(null);

  console.log('movieDetail : ', movieDetail);
  
  useEffect(() => {
  const endpoint = `${API_URL}/${params.id}?api_key=${API_KEY}&language=ko-KR`
  //console.log(endpoint);

    fetch(endpoint)
      .then(response => response.json())
      .then(response => setMovieDetail(response));
  }, [params.id]);

  return (
    <div>
      <div>

          <div>
            {movieDetail?.title}<br />
            <img src={`https://image.tmdb.org/t/p/w300${movieDetail?.poster_path}`} alt={movieDetail?.title} /><br />
            {movieDetail?.overview}<br /><br />
          </div>



      </div>
    </div>
  );
}

export default MovieDetailPage;