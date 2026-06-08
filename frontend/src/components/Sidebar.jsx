import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import {
  Home,
  Search,
  User,
  Users,
  LogOut,
  MessageCircle,
} from 'lucide-react';

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Follows', path: '/follows', icon: Users },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div
      style={{
        width: '240px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        borderRight: '1px solid var(--border-light)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#15090b',
        textAlign: 'left',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            paddingLeft: '8px',
          }}
        >
          <MessageCircle size={28} color="var(--accent)" />
          <span
            style={{
              fontSize: '22px',
              fontWeight: 'bold',
              letterSpacing: '-0.5px',
              color: 'var(--accent)',
            }}
          >
            Circle
          </span>
        </div>

        {/* Navigation links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => (isActive ? 'active-nav-link' : '')}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s',
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                backgroundColor: isActive ? 'rgba(36, 177, 177, 0.08)' : 'transparent',
                fontWeight: isActive ? '600' : '500',
              })}
            >
              <item.icon size={20} />
              <span style={{ fontSize: '15px' }}>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* User profile & Logout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {user && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
              <img
                src={user.avatar ? `http://localhost:7001${user.avatar}` : 'https://bit.ly/broken-link'}
                alt={user.fullName}
                onError={(e) => {
                  e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`;
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid var(--accent)',
                  backgroundColor: 'var(--accent)',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-light)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.fullName}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  @{user.username}
                </span>
              </div>
            </div>
            <hr style={{ border: 0, borderTop: '1px solid var(--border-light)', margin: 0 }} />
          </div>
        )}

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#fc8181',
            cursor: 'pointer',
            fontFamily: 'var(--sans)',
            fontSize: '15px',
            fontWeight: '500',
            width: '100%',
            textAlign: 'left',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(254, 178, 178, 0.08)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
