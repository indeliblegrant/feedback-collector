import { useState } from 'react';
import StarDisplay from './StarDisplay';

function formatDate(isoString) {
  return new Date(isoString).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function ReviewRow({ review, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <tr>
      <td>{formatDate(review.createdAt)}</td>
      <td>{review.name || <span className="anonymous">Anonymous</span>}</td>
      <td>
        <StarDisplay rating={review.rating} />
      </td>
      <td className="comment-cell">{review.comment}</td>
      <td className="actions-cell">
        {confirming ? (
          <div className="confirm-box">
            <span>Delete this review?</span>
            <button
              type="button"
              className="danger-button"
              onClick={() => onDelete(review.id)}
            >
              Yes, delete
            </button>
            <button
              type="button"
              className="plain-button"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="delete-button"
            onClick={() => setConfirming(true)}
          >
            Delete
          </button>
        )}
      </td>
    </tr>
  );
}

export default ReviewRow;
