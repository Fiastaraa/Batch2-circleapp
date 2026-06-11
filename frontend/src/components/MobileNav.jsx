import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, toggleTheme } from '../store/authSlice';
import { Home, Search, Users, User, LogOut, Sun, Moon } from 'lucide-react';

const items = [
  { path: '/',        icon: Home,   label: 'Home' },
  { path: '/search',  icon: Search, label: 'Search' },
  { path: '/follows', icon: Users,  label: 'Follows' },
  { path: '/profile', icon: User,   label: 'Profile' },
];

export default function MobileNav() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { theme } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="mobile-nav">
      {items.map(({ path, icon: Icon, label }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            color: isActive ? 'var(--accent)' : 'var(--text-muted)',
            textDecoration: 'none',
            transition: 'var(--transition)',
            flex: 1,
          })}
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span style={{ fontSize: '10px', fontWeight: isActive ? 700 : 500 }}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}

      {/* Theme Toggle */}
      <button
        onClick={() => dispatch(toggleTheme())}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          flex: 1,
        }}
      >
        {theme === 'light' ? <Moon size={22} strokeWidth={1.8} /> : <Sun size={22} strokeWidth={1.8} />}
        <span style={{ fontSize: '10px', fontWeight: 500 }}>{theme === 'light' ? 'Dark' : 'Light'}</span>
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          flex: 1,
        }}
      >
        <LogOut size={22} strokeWidth={1.8} />
        <span style={{ fontSize: '10px', fontWeight: 500 }}>Logout</span>
      </button>
    </nav>
  );
}
