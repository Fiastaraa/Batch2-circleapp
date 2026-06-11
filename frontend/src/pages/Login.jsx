import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, authSuccess, authFailure } from '../store/authSlice';
import api from '../services/api';
import { Flame, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData]  = useState({ email: '', password: '' });
  const [showPwd, setShowPwd]    = useState(false);
  const [errorMsg, setErrorMsg]  = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg('Semua kolom wajib diisi!');
      return;
    }
    dispatch(authStart());
    try {
      const res = await api.post('/login', formData);
      dispatch(authSuccess({ user: res.data.user, token: res.data.token }));
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error || 'Terjadi kesalahan saat login!';
      dispatch(authFailure(msg));
      setErrorMsg(msg);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: 'var(--bg-darkest)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* ── Decorative background blobs ── */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(118,0,49,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(186,106,76,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Left illustration panel (desktop) ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        background: 'linear-gradient(150deg, rgba(118,0,49,0.4) 0%, rgba(15,5,7,0) 60%)',
        borderRight: '1px solid var(--border)',
      }}
        className="login-left-panel"
      >
        <div style={{ maxWidth: '380px', textAlign: 'center' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
            boxShadow: '0 8px 32px var(--primary-glow)',
          }}>
            <Flame size={36} color="white" fill="white" />
          </div>

          <h1 style={{
            fontSize: '38px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--text-light) 60%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '12px',
            letterSpacing: '-1px',
            lineHeight: 1.1,
          }}>
            Circle
          </h1>

          <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: 0 }}>
            A space to share your thoughts, connect with others, and spark conversations.
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
        margin: '0 auto', /* center on mobile */
      }}>
        <div className="fade-in" style={{ width: '100%', maxWidth: '380px' }}>

          {/* Logo (mobile only) */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: '0 6px 20px var(--primary-glow)',
            }}>
              <Flame size={26} color="white" fill="white" />
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-light)', marginBottom: '4px', letterSpacing: '-0.5px' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              Log in to see what's happening
            </p>
          </div>

          {/* Error */}
          {errorMsg && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 92, 92, 0.12)',
              border: '1px solid rgba(255, 92, 92, 0.3)',
              color: '#ff7070',
              fontSize: '13px',
              marginBottom: '20px',
              textAlign: 'center',
            }}>
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-medium)' }}>
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-medium)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', height: '46px', fontSize: '15px', marginTop: '4px', borderRadius: 'var(--radius-md)' }}
            >
              {loading ? 'Logging in…' : (
                <>Log In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: '28px', textAlign: 'center' }}>
            <div style={{ height: '1px', backgroundColor: 'var(--border)', marginBottom: '20px' }} />
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--accent)', fontWeight: '700' }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
