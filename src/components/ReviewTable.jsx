import ReviewRow from './ReviewRow';
import './ReviewTable.css';

function ReviewTable({ reviews, onDelete }) {
  return (
    <div className="table-wrapper">
      <table className="review-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <ReviewRow key={review.id} review={review} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewTable;
