import { useState } from "react";
import { Link } from 'react-router-dom';


function SearchPage() {
  const [strSearch, setStrSearch]  = useState<string>('');
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_URL = 'https://api.themoviedb.org/3/search/movie';
  const [Result, setSearchResult] = useState<any[]>([]);
  
  const searchTxt = (event: React.ChangeEvent<HTMLInputElement>) =>{
    setStrSearch(event.target.value);
    //console.log(event.target.value);
  };

  const runSearch = () =>{
    const endpoint = `${API_URL}?api_key=${API_KEY}&query=${strSearch}&language=ko-KR`
    // console.log(endpoint);

    fetch(endpoint)
      .then(response => response.json())
      .then(response => setSearchResult(response.results));

  }

  const searchResult = (event: React.MouseEvent<HTMLButtonElement>) =>{
    runSearch();
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if(e.key === 'Enter') {
  	runSearch();
  }
}

  return (
    <div className = "search">
      <input
        className="search"
        type="text"
        placeholder="검색할 영화를 입력하세요"
        value={strSearch}
        onChange={searchTxt}
        onKeyDown={handleKeyDown}
      />
      <button onClick={searchResult}> Search</button>
      <br />
      <div>
        {Result.map((movie) => {
            const imageUrl = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
            return(
            <Link to={`/movie/${movie.id}`} key={movie.id}>
              <div>
                title={movie.title}<br />
                <img src={imageUrl} alt={movie.title} /><br />
                overview={movie.overview}<br /><br />
              </div>
            </Link>
          );
        })}

      </div>
    </div>
  );
}

export default SearchPage;