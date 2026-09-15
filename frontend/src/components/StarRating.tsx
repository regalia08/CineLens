import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
}

function StarRating({ rating, onChange }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating ?? rating;

  const calculateValue = (star: number, event: React.MouseEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - box.left;
    const isLeftHalf = clickX < box.width / 2;
    return isLeftHalf ? star - 0.5 : star;
  };

  return (
    <div className="flex gap-1 items-center" onMouseLeave={() => setHoverRating(null)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercent = Math.min(Math.max(displayRating - (star - 1), 0), 1) * 100;

        return (
          <div
            key={star}
            className="relative text-2xl w-6 h-6 cursor-pointer leading-none"
            onMouseMove={(e) => setHoverRating(calculateValue(star, e))}
            onClick={(e) => onChange(calculateValue(star, e))}
          >
            <span className="absolute text-zinc-600 -translate-y-1">★</span>
            <span
              className={`absolute overflow-hidden whitespace-nowrap -translate-y-1 ${
                hoverRating !== null ? 'text-yellow-200' : 'text-yellow-400'
              }`}
              style={{ width: `${fillPercent}%` }}
            >
              ★
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default StarRating;