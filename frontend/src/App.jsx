import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import { setProfile, logout } from './store/authSlice';
import api from './services/api';

// Components & Pages
import Sidebar from './components/Sidebar';
import RightBar from './components/RightBar';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ThreadDetail from './pages/ThreadDetail';
import Profile from './pages/Profile';
import Follows from './pages/Follows';
import Search from './pages/Search';

// ── Protected Layout with sidebar + rightbar ──────────────────────────────────
function ProtectedLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'var(--bg-darkest)',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        display: 'flex',
        position: 'relative',
      }}>

        {/* ── Left Sidebar (desktop only) ── */}
        <div className="desktop-sidebar">
          <Sidebar />
        </div>

        {/* ── Main Feed Column ── */}
        <div
          className="main-content"
          style={{
            flex: 1,
            borderLeft: '1px solid var(--border)',
            borderRight: '1px solid var(--border)',
            minHeight: '100vh',
            overflowY: 'auto',
            /* max-width keeps content readable */
            maxWidth: '680px',
          }}
        >
          <Outlet />
        </div>

        {/* ── Right Sidebar (desktop only ≥ 1024px) ── */}
        <div className="desktop-rightbar">
          <RightBar />
        </div>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <MobileNav />
    </div>
  );
}

// ── App Content with session initialisation ───────────────────────────────────
function AppContent() {
  const dispatch = useDispatch();
  const { token, isAuthenticated, theme } = useSelector((state) => state.auth);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const initApp = async () => {
      if (token && isAuthenticated) {
        try {
          const res = await api.get('/profile');
          dispatch(setProfile(res.data));
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          dispatch(logout());
        }
      }
      setInitializing(false);
    };
    initApp();
  }, [token, isAuthenticated, dispatch]);

  if (initializing) {
    return (
      <div className="loading-page">
        <div className="spinner" />
        <span>Loading session…</span>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route element={<ProtectedLayout />}>
        <Route path="/"            element={<Home />} />
        <Route path="/thread/:id"  element={<ThreadDetail />} />
        <Route path="/profile"     element={<Profile />} />
        <Route path="/follows"     element={<Follows />} />
        <Route path="/search"      element={<Search />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}
