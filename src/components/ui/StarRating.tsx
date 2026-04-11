interface StarRatingProps {
  stars: number;
  maxStars?: number;
}

export function StarRating({ stars, maxStars = 3 }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStars }, (_, i) => (
        <span
          key={i}
          className={`text-2xl transition-all duration-300 ${
            i < stars
              ? 'text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)] scale-110'
              : 'text-gray-600'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
