const HEADERS = ['Date', 'Name', 'Rating', 'Comment'];
const FORMULA_STARTERS = ['=', '+', '-', '@'];

// If a cell could be read as a spreadsheet formula, prefix a single quote.
function neutralizeFormula(text) {
  return FORMULA_STARTERS.includes(text.charAt(0)) ? `'${text}` : text;
}

// Wrap in double quotes and double any quotes inside.
// This also keeps commas and newlines safely inside one cell.
function escapeCell(value) {
  const text = neutralizeFormula(String(value ?? ''));
  return `"${text.replace(/"/g, '""')}"`;
}

export function reviewsToCsv(reviews) {
  const rows = reviews.map((review) => [
    review.createdAt,
    review.name,
    review.rating,
    review.comment,
  ]);

  return [HEADERS, ...rows]
    .map((row) => row.map(escapeCell).join(','))
    .join('\r\n');
}

// Local date as YYYY-MM-DD (not UTC, so it matches your own calendar).
function getFileDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function downloadReviewsCsv(reviews) {
  const csv = reviewsToCsv(reviews);

  // The \uFEFF at the start helps Excel read non-English characters correctly.
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `feedback-${getFileDate()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
