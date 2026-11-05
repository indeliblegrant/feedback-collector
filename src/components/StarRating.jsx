import { useState } from 'react';
import './StarRating.css';

const STARS = [1, 2, 3, 4, 5];

function StarRating({ value, onChange }) {
  const [hoverValue, setHoverValue] = useState(0);

  // While hovering, preview the hovered star. Otherwise show the chosen rating.
  const displayValue = hoverValue || value;

  return (
    <div
      className="star-rating"
      role="group"
      aria-label="Star rating"
      onMouseLeave={() => setHoverValue(0)}
    >
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          className={star <= displayValue ? 'star filled' : 'star'}
          aria-label={`Rate ${star} out of 5 stars`}
          aria-pressed={star === value}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverValue(star)}
        >
          <span aria-hidden="true">★</span>
        </button>
      ))}
    </div>
  );
}

export default StarRating;
