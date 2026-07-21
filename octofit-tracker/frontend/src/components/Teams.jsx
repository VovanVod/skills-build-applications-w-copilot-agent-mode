import { useEffect, useState } from 'react';
import { fetchResource, isCodespaceFallback } from './apiClient';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadTeams() {
      setIsLoading(true);
      setError('');

      try {
        // Codespaces endpoint format: https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams/
        const result = await fetchResource('/api/teams/', controller.signal);
        setTeams(result.items);
        setMeta(result.meta);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load teams.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadTeams();

    return () => controller.abort();
  }, []);

  return (
    <section>
      <h2 className="h4 mb-3">Teams</h2>
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
        <div className="text-secondary">Loading teams...</div>
      ) : (
        <>
          <div className="row g-3">
            {teams.map((team) => (
              <div className="col-md-6" key={team._id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h3 className="h5 card-title mb-2">{team.name}</h3>
                    <p className="mb-1 text-secondary">City: {team.city}</p>
                    <p className="mb-2">{team.motto}</p>
                    <span className="badge text-bg-primary">
                      Members: {team.members?.length ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!teams.length && <div className="text-secondary">No teams found.</div>}
          {meta && (
            <p className="text-secondary small mb-0 mt-3">
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

export default Teams;
