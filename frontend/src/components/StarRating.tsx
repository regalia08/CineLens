import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
}

function StarRating({ rating, onChange }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const isHovering = hoverRating !== null;
  const displayRating = hoverRating ?? rating;

  return (
    <div className="flex gap-1" onMouseLeave={() => setHoverRating(null)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          className={`text-2xl transition-colors ${
            star <= displayRating
              ? isHovering
                ? 'text-yellow-200'
                : 'text-yellow-400'
              : 'text-zinc-600'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default StarRating;