const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(path, options = {}) {
  if (!BASE_URL) {
    throw new Error(
      'VITE_API_BASE_URL is not set. Copy .env.example to .env and restart npm run dev.'
    );
  }

  let response;
  try {
    response = await fetch(`${BASE_URL.replace(/\/+$/, '')}${path}`, options);
  } catch {
    throw new Error('Could not reach the server. Is the backend running?');
  }

  if (response.status === 204) {
    return null;
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // The server sent no JSON; handled below.
  }

  if (!response.ok) {
    const error = new Error(data?.message || 'Something went wrong.');
    error.errors = data?.errors;
    throw error;
  }

  return data;
}

export function getReviews() {
  return request('/reviews');
}

export function createReview(review) {
  return request('/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
}

export function deleteReview(id) {
  return request(`/reviews/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
