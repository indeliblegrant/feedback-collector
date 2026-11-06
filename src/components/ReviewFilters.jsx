import './ReviewFilters.css';

function ReviewFilters({
  ratingFilter,
  onRatingChange,
  searchText,
  onSearchChange,
}) {
  return (
    <div className="review-filters">
      <div className="filter-field">
        <label htmlFor="rating-filter">Rating</label>
        <select
          id="rating-filter"
          value={ratingFilter}
          onChange={(event) => onRatingChange(event.target.value)}
        >
          <option value="all">All</option>
          <option value="1">1 star</option>
          <option value="2">2 stars</option>
          <option value="3">3 stars</option>
          <option value="4">4 stars</option>
          <option value="5">5 stars</option>
        </select>
      </div>

      <div className="filter-field filter-search">
        <label htmlFor="comment-search">Search comments</label>
        <input
          id="comment-search"
          type="search"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Type to search..."
        />
      </div>
    </div>
  );
}

export default ReviewFilters;
