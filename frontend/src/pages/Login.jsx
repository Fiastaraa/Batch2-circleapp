import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, authSuccess, authFailure } from '../store/authSlice';
import api from '../services/api';
import { MessageCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert('Semua kolom wajib diisi!');
      return;
    }

    dispatch(authStart());
    try {
      const res = await api.post('/login', formData);
      dispatch(
        authSuccess({
          user: res.data.user,
          token: res.data.token,
        })
      );
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Terjadi kesalahan saat login!';
      dispatch(authFailure(errorMsg));
      alert(errorMsg);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#15090b',
        padding: '16px',
      }}
    >
      <div
        className="glass fade-in"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageCircle size={36} color="var(--accent)" />
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                letterSpacing: '-0.5px',
                color: 'var(--accent)',
                margin: 0,
              }}
            >
              Circle
            </h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-light)', margin: 0 }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              Log in to see what your friends are talking about.
            </p>
          </div>

          {/* Form */}
          <form style={{ width: '100%' }} onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-light)' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="name@email.com"
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-light)' }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  height: '44px',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                }}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </div>
          </form>

          {/* Link to Register */}
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
            Don't have an account?{' '}
            <RouterLink to="/register" style={{ color: 'var(--accent)', fontWeight: '600' }}>
              Sign Up
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  );
}
