import { useCallback, useEffect, useState } from 'react';
import { getReviews, deleteReview } from '../utils/api';

function useReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setReviews(await getReviews());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Throws if the server refuses, so the caller can show a message.
  const removeReview = async (id) => {
    await deleteReview(id);
    setReviews((prev) => prev.filter((review) => review.id !== id));
  };

  return { reviews, loading, error, reload: load, removeReview };
}

export default useReviews;
