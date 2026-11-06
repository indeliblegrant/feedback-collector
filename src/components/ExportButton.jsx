import { downloadReviewsCsv } from '../utils/exportCsv';
import './ExportButton.css';

function ExportButton({ reviews }) {
  const isEmpty = reviews.length === 0;

  return (
    <button
      type="button"
      className="export-button"
      disabled={isEmpty}
      title={isEmpty ? 'There are no reviews to export' : 'Download as CSV'}
      onClick={() => downloadReviewsCsv(reviews)}
    >
      Export CSV
    </button>
  );
}

export default ExportButton;
