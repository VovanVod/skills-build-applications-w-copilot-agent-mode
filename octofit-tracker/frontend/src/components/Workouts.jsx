import { useEffect, useState } from 'react';
import { fetchResource, isCodespaceFallback } from './apiClient';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadWorkouts() {
      setIsLoading(true);
      setError('');

      try {
        const result = await fetchResource('workouts', controller.signal);
        setWorkouts(result.items);
        setMeta(result.meta);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load workouts.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadWorkouts();

    return () => controller.abort();
  }, []);

  return (
    <section>
      <h2 className="h4 mb-3">Workouts</h2>
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
        <div className="text-secondary">Loading workouts...</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Title</th>
                  <th>Focus Area</th>
                  <th>Difficulty</th>
                  <th>Duration</th>
                  <th>Scheduled</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout) => (
                  <tr key={workout._id}>
                    <td>{workout.user?.name ?? '-'}</td>
                    <td>{workout.title}</td>
                    <td>{workout.focusArea}</td>
                    <td className="text-capitalize">{workout.difficulty}</td>
                    <td>{workout.durationMinutes} min</td>
                    <td>{new Date(workout.scheduledFor).toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge ${workout.completed ? 'text-bg-success' : 'text-bg-secondary'}`}
                      >
                        {workout.completed ? 'Completed' : 'Planned'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!workouts.length && <div className="text-secondary">No workouts found.</div>}
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

export default Workouts;
