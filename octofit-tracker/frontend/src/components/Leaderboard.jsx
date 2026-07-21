import { useEffect, useState } from 'react';
import { fetchResource, isCodespaceFallback } from './apiClient';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadLeaderboard() {
      setIsLoading(true);
      setError('');

      try {
        // Codespaces endpoint format: https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/
        const result = await fetchResource('/api/leaderboard/', controller.signal);
        setEntries(result.items);
        setMeta(result.meta);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load leaderboard.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadLeaderboard();

    return () => controller.abort();
  }, []);

  return (
    <section>
      <h2 className="h4 mb-3">Leaderboard</h2>
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
        <div className="text-secondary">Loading leaderboard...</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Points</th>
                  <th>Week</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry._id}>
                    <td>#{entry.rank}</td>
                    <td>{entry.user?.name ?? '-'}</td>
                    <td>{entry.points}</td>
                    <td>{entry.weekLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!entries.length && <div className="text-secondary">No leaderboard entries found.</div>}
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

export default Leaderboard;
