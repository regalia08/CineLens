import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = 'https://api.themoviedb.org/3/movie';



function MovieDetailPage() {
  const params = useParams();
  const [movieDetail, setMovieDetail] = useState<any>(null);
  const [strRating, setRating] = useState<number>(0);

  //console.log('movieDetail : ', movieDetail);

  useEffect(() => {
    const endpoint = `${API_URL}/${params.id}?api_key=${API_KEY}&language=ko-KR`
    //console.log(endpoint);

    fetch(endpoint)
      .then(response => response.json())
      .then(response => setMovieDetail(response));
  }, [params.id]);

  async function addView() {
    const result = await apiRequest('/api/watched-movies', {
      method: 'POST',
      body: JSON.stringify({
        movieId: parseInt(params.id ?? '0'),
        rating: strRating,
      }),
    });
    //console.log(result);

  }

  useEffect(() => {
    async function checkExisting() {
      const watchedList = await apiRequest('/api/watched-movies');
      const existing = watchedList.find((item) => item.movieId === parseInt(params.id ?? '0'));
      if (existing) {
        setRating(existing.rating);
      }
    }
    checkExisting();
  }, [params.id]);

  const searchTxt = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRating(parseFloat(event.target.value));
    //console.log(event.target.value);
  };

  return (
    <div>
      <div>

        <div>
          <div>
            {movieDetail?.title ? (
              <>
                {movieDetail.title}<br />
                <img src={`https://image.tmdb.org/t/p/w300${movieDetail.poster_path}`} alt={movieDetail.title} /><br />
                {movieDetail.overview}<br /><br />
                <input type="number" min="0" max="5" step="0.5" onChange={searchTxt} value={strRating}></input>
                <button onClick={addView}>Viewed</button>
              </>
            ) : (
              <div>존재하지 않는 영화입니다.</div>
            )}
          </div>
        </div>



      </div>
    </div>
  );
}

export default MovieDetailPage;