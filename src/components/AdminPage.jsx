import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import SummaryCards from './SummaryCards';
import ReviewFilters from './ReviewFilters';
import ReviewTable from './ReviewTable';
import EmptyState from './EmptyState';
import ExportButton from './ExportButton';
import './AdminPage.css';

function AdminPage() {
  const [reviews, setReviews] = useLocalStorage('reviews', []);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [searchText, setSearchText] = useState('');

  const total = reviews.length;
  const average =
    total === 0
      ? null
      : reviews.reduce((sum, review) => sum + review.rating, 0) / total;

  const search = searchText.trim().toLowerCase();

  const visibleReviews = reviews
    .filter(
      (review) =>
        ratingFilter === 'all' || review.rating === Number(ratingFilter)
    )
    .filter((review) => review.comment.toLowerCase().includes(search))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleDelete = (id) => {
    setReviews((prev) => prev.filter((review) => review.id !== id));
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Admin</h1>
        <ExportButton reviews={visibleReviews} />
      </div>

      <SummaryCards total={total} average={average} />

      {total === 0 ? (
        <EmptyState
          title="No reviews yet"
          message="Reviews will show up here once someone submits feedback."
        />
      ) : (
        <>
          <ReviewFilters
            ratingFilter={ratingFilter}
            onRatingChange={setRatingFilter}
            searchText={searchText}
            onSearchChange={setSearchText}
          />

          {visibleReviews.length === 0 ? (
            <EmptyState
              title="No matching reviews"
              message="Try a different star rating or search word."
            />
          ) : (
            <ReviewTable reviews={visibleReviews} onDelete={handleDelete} />
          )}
        </>
      )}
    </div>
  );
}

export default AdminPage;
