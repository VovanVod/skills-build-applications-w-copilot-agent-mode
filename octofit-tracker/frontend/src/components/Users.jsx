import { useEffect, useState } from 'react';
import { fetchResource, isCodespaceFallback } from './apiClient';

function Users() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      setIsLoading(true);
      setError('');

      try {
        const result = await fetchResource('/api/users/', controller.signal);
        setUsers(result.items);
        setMeta(result.meta);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load users.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadUsers();

    return () => controller.abort();
  }, []);

  return (
    <section>
      <h2 className="h4 mb-3">Users</h2>
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
        <div className="text-secondary">Loading users...</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Fitness Level</th>
                  <th>Team</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.age}</td>
                    <td className="text-capitalize">{user.fitnessLevel}</td>
                    <td>{user.team?.name ?? '-'}</td>
                    <td>{user.totalPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!users.length && <div className="text-secondary">No users found.</div>}
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

export default Users;
