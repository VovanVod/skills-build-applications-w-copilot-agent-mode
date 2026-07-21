import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import { apiBaseUrl } from './components/apiClient';
import './App.css';

function navClassName({ isActive }) {
  return `btn btn-outline-primary nav-link-pill${isActive ? ' active' : ''}`;
}

function App() {
  return (
    <div className="app-shell container py-4 py-lg-5">
      <header className="mb-4">
        <h1 className="display-6 mb-2">OctoFit Tracker</h1>
        <p className="text-secondary mb-3">
          React 19 presentation tier connected to the Express + MongoDB API.
        </p>
        <p className="small mb-3">
          <span className="text-secondary">API base:</span> <code>{apiBaseUrl}</code>
        </p>
        <nav className="nav nav-pills flex-wrap gap-2">
          <NavLink to="/users" className={navClassName}>
            Users
          </NavLink>
          <NavLink to="/activities" className={navClassName}>
            Activities
          </NavLink>
          <NavLink to="/teams" className={navClassName}>
            Teams
          </NavLink>
          <NavLink to="/leaderboard" className={navClassName}>
            Leaderboard
          </NavLink>
          <NavLink to="/workouts" className={navClassName}>
            Workouts
          </NavLink>
        </nav>
      </header>

      <main className="card shadow-sm">
        <div className="card-body p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/users" replace />} />
            <Route path="/users" element={<Users />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="*" element={<Navigate to="/users" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
