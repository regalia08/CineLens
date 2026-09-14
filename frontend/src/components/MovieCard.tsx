import { Link } from "react-router-dom";

interface MovieCardProps {
  movieId: number;
  title: string;
  posterPath?: string;
  subtitle?: string;
  onDelete?: () => void;
}

function MovieCard({ movieId, title, posterPath, subtitle, onDelete }: MovieCardProps) {
  const imageUrl = posterPath
    ? `https://image.tmdb.org/t/p/w300${posterPath}`
    : null;

  return (
    <div className="relative group">
      <Link to={`/movie/${movieId}`} className="block">
        <div className="aspect-[2/3] bg-zinc-800 rounded-md overflow-hidden mb-2 group-hover:scale-105 transition-transform">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm text-center p-2">
              포스터 없음
            </div>
          )}
        </div>
        <p className="text-sm font-medium truncate">{title}</p>
        {subtitle && <p className="text-xs text-zinc-400 truncate">{subtitle}</p>}
      </Link>

      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
          className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default MovieCard;