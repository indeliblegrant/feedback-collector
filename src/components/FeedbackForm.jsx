import { useState } from 'react';
import StarRating from './StarRating';
import useLocalStorage from '../hooks/useLocalStorage';
import './FeedbackForm.css';

const MAX_COMMENT_LENGTH = 500;

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function validate(rating, comment) {
  const errors = {};

  if (rating === 0) {
    errors.rating = 'Please choose a star rating.';
  }

  if (comment.trim() === '') {
    errors.comment = 'Please write a comment.';
  } else if (comment.length > MAX_COMMENT_LENGTH) {
    errors.comment = `Comment must be ${MAX_COMMENT_LENGTH} characters or fewer.`;
  }

  return errors;
}

function FeedbackForm() {
  const [, setReviews] = useLocalStorage('reviews', []);

  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleNameChange = (event) => {
    setName(event.target.value);
    setSubmitted(false);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    setErrors((prev) => ({ ...prev, rating: undefined }));
    setSubmitted(false);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
    setErrors((prev) => ({ ...prev, comment: undefined }));
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validate(rating, comment);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    const newReview = {
      id: createId(),
      name: name.trim(),
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [...prev, newReview]);

    setName('');
    setRating(0);
    setComment('');
    setSubmitted(true);
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit} noValidate>
      {submitted && (
        <p className="thank-you" role="status">
          Thank you! Your feedback has been submitted.
        </p>
      )}

      <div className="form-field">
        <label htmlFor="name">Name (optional)</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Your name"
        />
      </div>

      <div className="form-field">
        <span className="field-label" id="rating-label">
          Rating (required)
        </span>
        <StarRating value={rating} onChange={handleRatingChange} />
        {errors.rating && (
          <p className="error" role="alert">
            {errors.rating}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="comment">Comment (required)</label>
        <textarea
          id="comment"
          rows="5"
          maxLength={MAX_COMMENT_LENGTH}
          value={comment}
          onChange={handleCommentChange}
          placeholder="Tell us what you think"
          aria-invalid={errors.comment ? 'true' : 'false'}
          aria-describedby="comment-counter"
        />
        <p className="counter" id="comment-counter">
          {comment.length} / {MAX_COMMENT_LENGTH}
        </p>
        {errors.comment && (
          <p className="error" role="alert">
            {errors.comment}
          </p>
        )}
      </div>

      <button type="submit" className="submit-button">
        Submit feedback
      </button>
    </form>
  );
}

export default FeedbackForm;
