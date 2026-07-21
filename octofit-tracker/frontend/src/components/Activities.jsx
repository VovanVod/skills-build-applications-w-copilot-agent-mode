import { useEffect, useState } from 'react';
import { fetchResource, isCodespaceFallback } from './apiClient';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadActivities() {
      setIsLoading(true);
      setError('');

      try {
        const result = await fetchResource('activities', controller.signal);
        setActivities(result.items);
        setMeta(result.meta);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load activities.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadActivities();

    return () => controller.abort();
  }, []);

  return (
    <section>
      <h2 className="h4 mb-3">Activities</h2>
      {isCodespaceFallback && (
        <div className="alert alert-warning" role="alert">
          VITE_CODESPACE_NAME is not set. Using localhost fallback.
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="text-secondary">Loading activities...</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Distance</th>
                  <th>Calories</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity._id}>
                    <td>{activity.user?.name ?? '-'}</td>
                    <td className="text-capitalize">{activity.type}</td>
                    <td>{activity.durationMinutes} min</td>
                    <td>{activity.distanceKm ?? '-'} km</td>
                    <td>{activity.calories}</td>
                    <td>{new Date(activity.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!activities.length && <div className="text-secondary">No activities found.</div>}
          {meta && (
            <p className="text-secondary small mb-0 mt-2">
              Showing {meta.count} item(s)
              {meta.total !== null ? ` of ${meta.total}` : ''}
              {meta.page !== null ? `, page ${meta.page}` : ''}
              {meta.totalPages !== null ? `/${meta.totalPages}` : ''}
            </p>
          )}
        </>
      )}
    </section>
  );
}

export default Activities;
