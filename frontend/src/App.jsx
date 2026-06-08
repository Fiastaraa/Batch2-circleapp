import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import { setProfile, logout } from './store/authSlice';
import api from './services/api';

// Components & Pages
import Sidebar from './components/Sidebar';
import RightBar from './components/RightBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ThreadDetail from './pages/ThreadDetail';
import Profile from './pages/Profile';
import Follows from './pages/Follows';
import Search from './pages/Search';

// Wrapper Layout untuk Halaman Terproteksi
function ProtectedLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#15090b',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          borderLeft: '1px solid var(--border-light)',
          borderRight: '1px solid var(--border-light)',
          display: 'flex',
        }}
      >
        {/* Sidebar Kiri */}
        <Sidebar />

        {/* Konten Halaman Tengah */}
        <div
          style={{
            flex: 1,
            borderRight: '1px solid var(--border-light)',
            minHeight: '100vh',
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </div>

        {/* Sidebar Kanan */}
        <RightBar />
      </div>
    </div>
  );
}

// App Content dengan inisialisasi state user profile
function AppContent() {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const [initializing, setInitializing] = useState(true);

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
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#15090b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent)',
          fontSize: '16px',
          fontWeight: '600',
        }}
      >
        Loading Session...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/thread/:id" element={<ThreadDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/follows" element={<Follows />} />
        <Route path="/search" element={<Search />} />
      </Route>

      {/* Fallback redirect */}
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
