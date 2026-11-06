import './SummaryCards.css';

function SummaryCards({ total, average }) {
  return (
    <div className="summary-cards">
      <div className="summary-card">
        <p className="summary-label">Total reviews</p>
        <p className="summary-value">{total}</p>
      </div>
      <div className="summary-card">
        <p className="summary-label">Average rating</p>
        <p className="summary-value">
          {average === null ? '–' : average.toFixed(1)}
        </p>
      </div>
    </div>
  );
}

export default SummaryCards;
