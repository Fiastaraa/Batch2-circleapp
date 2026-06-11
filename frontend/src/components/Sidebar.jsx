import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, toggleTheme } from '../store/authSlice';
import { Home, Search, Users, User, LogOut, Flame, Sun, Moon } from 'lucide-react';

const navItems = [
  { name: 'Home',    path: '/',        icon: Home },
  { name: 'Search',  path: '/search',  icon: Search },
  { name: 'Follows', path: '/follows', icon: Users },
  { name: 'Profile', path: '/profile', icon: User },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, theme }  = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside
      style={{
        width: '260px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        padding: '28px 16px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
        flexShrink: 0,
      }}
    >
      {/* ── Top section ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            paddingLeft: '12px',
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px var(--primary-glow)',
          }}>
            <Flame size={18} color="white" fill="white" />
          </div>
          <span style={{
            fontSize: '22px',
            fontWeight: '800',
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--text-light) 80%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Circle
          </span>
        </div>

        {/* Navigation links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              end={path === '/'}
              className={({ isActive }) => isActive ? 'active-nav' : ''}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--text-light)' : 'var(--text-muted)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '15px',
                textDecoration: 'none',
                transition: 'var(--transition)',
                backgroundColor: isActive ? 'rgba(186, 106, 76, 0.12)' : 'transparent',
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains('active-nav')) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 227, 227, 0.04)';
                  e.currentTarget.style.color = 'var(--text-light)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.classList.contains('active-nav')) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              <Icon size={21} />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ── Bottom section: User + Logout ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(255, 227, 227, 0.04)',
            border: '1px solid var(--border)',
          }}>
            <img
              src={user.avatar ? `http://localhost:7001${user.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`}
              alt={user.fullName}
              className="avatar-ring"
              onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`; }}
              style={{ width: '38px', height: '38px' }}
            />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '700',
                color: 'var(--text-light)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {user.fullName}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                @{user.username}
              </div>
            </div>
          </div>
        )}

        {/* Theme Toggle button */}
        <button
          onClick={() => dispatch(toggleTheme())}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontWeight: '500',
            fontSize: '15px',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
            transition: 'var(--transition)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 227, 227, 0.04)';
            e.currentTarget.style.color = 'var(--text-light)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          {theme === 'light' ? <Moon size={21} /> : <Sun size={21} />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontWeight: '500',
            fontSize: '15px',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
            transition: 'var(--transition)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 92, 92, 0.08)';
            e.currentTarget.style.color = '#ff7070';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <LogOut size={21} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
