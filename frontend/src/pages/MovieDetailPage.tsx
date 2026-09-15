import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import StarRating from "../components/StarRating";
import Spinner from "../components/Spinner";


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = 'https://api.themoviedb.org/3/movie';



function MovieDetailPage() {
  const params = useParams();
  const [movieDetail, setMovieDetail] = useState<any>(null);
  const [strRating, setRating] = useState<number>(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [savedRating, setSavedRating] = useState<number>(0);

  //console.log('movieDetail : ', movieDetail);

  useEffect(() => {
    setImageLoaded(false);
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
    setSavedRating(strRating);
    alert('평점이 저장되었습니다!');

  }

  useEffect(() => {
    async function checkExisting() {
      const watchedList = await apiRequest('/api/watched-movies');
      const existing = watchedList.find((item) => item.movieId === parseInt(params.id ?? '0'));
      if (existing) {
        setRating(existing.rating);
        setSavedRating(existing.rating);
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
              <div className="flex justify-center mt-20">
                <Spinner />
              </div>
            ) : movieDetail.title ? (
              <div className="flex flex-col sm:flex-row gap-8 max-w-4xl pb-12">
                <div className="w-64 aspect-[2/3] rounded-lg flex-shrink-0 bg-zinc-900 relative overflow-hidden">
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center gap-2">
                      <Spinner />
                      <p className="text-zinc-500 text-xs">포스터 불러오는 중...</p>
                    </div>
                  )}
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`}
                    alt={movieDetail.title}
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-4">{movieDetail.title}</h1>
                  <p className="text-zinc-400 leading-relaxed pb-3">{movieDetail.overview}</p>

                  <div className="border-t border-zinc-800 pt-6 flex items-center gap-4">
                    <div className="flex items-center gap-0.5">
                      <span className="text-base font-medium text-zinc-300">내 평점</span>
                      <StarRating rating={strRating} onChange={setRating} />
                    </div>
                    <button
                      onClick={addView}
                      className="bg-red-600 hover:bg-red-700 px-4 py-1.5 ml-1 rounded text-sm font-medium transition-colors"
                    >
                      Viewed
                    </button>
                    {strRating !== savedRating && (
                      <span className="text-xs text-yellow-400">저장되지 않은 변경사항</span>
                    )}
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