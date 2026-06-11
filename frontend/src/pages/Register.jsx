import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Flame, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, fullName } = formData;
    if (!username || !email || !password || !fullName) {
      setErrorMsg('Semua kolom wajib diisi!');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password minimal 6 karakter!');
      return;
    }
    setLoading(true);
    try {
      await api.post('/register', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Terjadi kesalahan saat registrasi!');
    } finally {
      setLoading(false);
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
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-8%',
        width: '480px', height: '480px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(118,0,49,0.22) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-12%', left: '-8%',
        width: '380px', height: '380px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(186,106,76,0.13) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Form panel ── */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
      }}>
        <div className="fade-in" style={{ width: '100%', maxWidth: '420px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: '0 6px 20px var(--primary-glow)',
            }}>
              <Flame size={26} color="white" fill="white" />
            </div>
            <h1 style={{
              fontSize: '26px', fontWeight: '800',
              color: 'var(--text-light)', marginBottom: '4px', letterSpacing: '-0.5px',
            }}>
              Create your account
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              Join Circle and start sharing your thoughts
            </p>
          </div>

          {/* Success state */}
          {success ? (
            <div style={{
              textAlign: 'center',
              padding: '32px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(78, 203, 113, 0.1)',
              border: '1px solid rgba(78, 203, 113, 0.25)',
            }}>
              <CheckCircle2 size={48} color="#4ecb71" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#4ecb71', marginBottom: '6px' }}>
                Registrasi berhasil!
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Mengalihkan ke halaman login…
              </div>
            </div>
          ) : (
            <>
              {/* Error */}
              {errorMsg && (
                <div style={{
                  padding: '12px 16px', borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 92, 92, 0.12)',
                  border: '1px solid rgba(255, 92, 92, 0.3)',
                  color: '#ff7070', fontSize: '13px', marginBottom: '20px', textAlign: 'center',
                }}>
                  {errorMsg}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* Row: Username + FullName */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-medium)' }}>Username</label>
                    <input
                      id="reg-username"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="fia_star"
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-medium)' }}>Full Name</label>
                    <input
                      id="reg-fullname"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Fia Fiastara"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-medium)' }}>Email address</label>
                  <input
                    id="reg-email"
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
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-medium)' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="reg-password"
                      type={showPwd ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Min. 6 characters"
                      autoComplete="new-password"
                      required
                      style={{ paddingRight: '44px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((p) => !p)}
                      style={{
                        position: 'absolute', right: '12px', top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none', border: 'none',
                        color: 'var(--text-muted)', cursor: 'pointer',
                        padding: '4px', display: 'flex', alignItems: 'center',
                      }}
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formData.password && (
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      {[...Array(4)].map((_, i) => (
                        <div key={i} style={{
                          flex: 1, height: '3px', borderRadius: '2px',
                          backgroundColor: formData.password.length > i * 2
                            ? formData.password.length >= 8 ? '#4ecb71'
                              : formData.password.length >= 6 ? 'var(--accent)' : 'var(--primary)'
                            : 'var(--border)',
                          transition: 'background-color 0.3s',
                        }} />
                      ))}
                    </div>
                  )}
                </div>

                <button
                  id="reg-submit"
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%', height: '46px', fontSize: '15px', marginTop: '8px', borderRadius: 'var(--radius-md)' }}
                >
                  {loading ? 'Creating account…' : (
                    <>Create Account <ArrowRight size={16} /></>
                  )}
                </button>
              </form>

              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <div style={{ height: '1px', backgroundColor: 'var(--border)', marginBottom: '20px' }} />
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '700' }}>
                    Log in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
