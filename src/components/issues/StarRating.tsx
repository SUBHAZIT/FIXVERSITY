import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number | null;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function StarRating({ rating, onRate, readonly = false, size = 'md' }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating ?? rating ?? 0;

  const handleClick = (star: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!readonly && onRate) {
      onRate(star);
    }
  };

  return (
    <div 
      className="flex items-center gap-0.5"
      onClick={(e) => e.stopPropagation()}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={(e) => handleClick(star, e)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(null)}
          className={cn(
            'transition-all',
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              'transition-colors',
              star <= displayRating
                ? 'fill-warning text-warning'
                : 'text-muted-foreground/30'
            )}
          />
        </button>
      ))}
    </div>
  );
}