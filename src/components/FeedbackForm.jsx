import { useState } from 'react';
import StarRating from './StarRating';
import { createReview } from '../utils/api';
import './FeedbackForm.css';

const MAX_COMMENT_LENGTH = 500;
const MAX_NAME_LENGTH = 100;

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
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
    setErrors((prev) => ({ ...prev, name: undefined }));
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    const validationErrors = validate(rating, comment);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    setSubmitting(true);

    try {
      await createReview({
        name: name.trim(),
        rating,
        comment: comment.trim(),
      });

      setName('');
      setRating(0);
      setComment('');
      setSubmitted(true);
    } catch (error) {
      // Keep what the user typed so they can try again.
      setErrors(error.errors || {});
      setSubmitError(error.message);
      setSubmitted(false);
    } finally {
      setSubmitting(false);
    }
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
          maxLength={MAX_NAME_LENGTH}
          onChange={handleNameChange}
          placeholder="Your name"
        />
        {errors.name && (
          <p className="error" role="alert">
            {errors.name}
          </p>
        )}
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

      {submitError && (
        <p className="error" role="alert">
          {submitError}
        </p>
      )}

      <button type="submit" className="submit-button" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit feedback'}
      </button>
    </form>
  );
}

export default FeedbackForm;
