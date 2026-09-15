import { Star } from "lucide-react";

interface StarDisplayProps {
  rating: number;
}

function StarDisplay({ rating }: StarDisplayProps) {
  return (
    <div className="flex justify-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercent = Math.min(Math.max(rating - (star - 1), 0), 1) * 100;

        return (
          <div key={star} className="relative w-4 h-4">
            <Star className="absolute w-4 h-4 text-zinc-600" fill="currentColor" />
            <div className="absolute overflow-hidden" style={{ width: `${fillPercent}%` }}>
              <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StarDisplay;