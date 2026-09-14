import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import StarRating from "../components/StarRating";


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
            {movieDetail === null ? (
              <div className="text-center text-zinc-400 mt-20">로딩 중...</div>
            ) : movieDetail.title ? (
              <div className="flex gap-8 max-w-4xl">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movieDetail.poster_path}`}
                  alt={movieDetail.title}
                  className="w-64 rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-4">{movieDetail.title}</h1>
                  <p className="text-zinc-400 leading-relaxed mb-6">{movieDetail.overview}</p>

                  <div className="flex items-center gap-3">
                    <label className="text-sm text-zinc-400">내 평점</label>
                    <StarRating rating={strRating} onChange={setRating} />
                    <button
                      onClick={addView}
                      className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-medium transition-colors"
                    >
                      Viewed
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-zinc-400 mt-20">존재하지 않는 영화입니다.</div>
            )}
          </div>
        </div>



      </div>
    </div>
  );
}

export default MovieDetailPage;