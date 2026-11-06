import './StarDisplay.css';

const STARS = [1, 2, 3, 4, 5];

function StarDisplay({ rating }) {
  return (
    <span
      className="star-display"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {STARS.map((star) => (
        <span
          key={star}
          className={star <= rating ? 'display-star filled' : 'display-star'}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default StarDisplay;
