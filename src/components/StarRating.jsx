import { Star } from "lucide-react";

export default function StarRating({
  value = 0,
  count,
  size = "sm",
  interactive = false,
  onChange,
  className = "",
}) {
  const numericValue = Math.max(0, Math.min(5, Number(value) || 0));
  const roundedValue = Math.round(numericValue);
  const starSize = {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
  }[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-0.5" aria-label={`${numericValue.toFixed(1)} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((rating) => {
          const isFilled = rating <= roundedValue;
          const IconWrapper = interactive ? "button" : "span";

          return (
            <IconWrapper
              key={rating}
              type={interactive ? "button" : undefined}
              onClick={interactive ? () => onChange?.(rating) : undefined}
              className={interactive ? "rounded p-0.5 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-slate-900" : ""}
              aria-label={interactive ? `Rate ${rating} out of 5` : undefined}
            >
              <Star
                size={starSize}
                className={isFilled ? "fill-amber-400 text-amber-400" : "fill-none text-slate-300"}
              />
            </IconWrapper>
          );
        })}
      </div>
      {count !== undefined && (
        <span className="text-xs text-slate-500">
          {numericValue.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}
