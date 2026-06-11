import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMyThreads, fetchStart, fetchFailure } from '../store/threadSlice';
import { updateProfileSuccess } from '../store/authSlice';
import api from '../services/api';
import ThreadCard from '../components/ThreadCard';
import { Edit3, Camera, Database, Zap, X, Grid3x3 } from 'lucide-react';

export default function Profile() {
  const dispatch      = useDispatch();
  const avatarInputRef = useRef(null);
  const { user }      = useSelector((state) => state.auth);
  const { myThreads, cacheSource, loading } = useSelector((state) => state.threads);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm]       = useState({ fullName: '', bio: '' });
  const [avatarFile, setAvatarFile]   = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [updating, setUpdating]       = useState(false);

  const fetchMyThreads = async () => {
    dispatch(fetchStart());
    try {
      const res = await api.get('/threads/my');
      dispatch(setMyThreads({ source: res.data.source, data: res.data.data }));
    } catch (err) {
      dispatch(fetchFailure(err.response?.data?.error || 'Gagal memuat timeline profil.'));
    }
  };

  useEffect(() => { if (user) fetchMyThreads(); }, [user]);

  const handleOpenEdit = () => {
    setEditForm({ fullName: user.fullName || '', bio: user.bio || '' });
    setAvatarPreview(user.avatar ? `http://localhost:7001${user.avatar}` : null);
    setIsModalOpen(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('fullName', editForm.fullName);
      formData.append('bio', editForm.bio);
      if (avatarFile) formData.append('avatar', avatarFile);
      const res = await api.put('/profile/update', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      dispatch(updateProfileSuccess(res.data.user));
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal memperbarui profil.');
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return null;

  const avatarSrc = user.avatar
    ? `http://localhost:7001${user.avatar}`
    : `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`;

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-darkest)' }}>

      {/* ── Header ── */}
      <div className="glass-header" style={{ padding: '16px 20px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-light)', margin: 0, letterSpacing: '-0.3px' }}>
          Profile
        </h2>
      </div>

      {/* ── Cover + Avatar ── */}
      <div style={{ position: 'relative' }}>
        {/* Cover gradient */}
        <div style={{
          height: '120px',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 60%, #c87c5a 100%)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }} />
        </div>

        {/* Profile actions row */}
        <div style={{
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: '-48px',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Avatar */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={avatarSrc}
              alt={user.fullName}
              style={{
                width: '84px', height: '84px', borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid var(--bg-darkest)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                backgroundColor: 'var(--bg-card)',
              }}
            />
          </div>

          {/* Edit button */}
          <button
            onClick={handleOpenEdit}
            className="btn-secondary"
            style={{ padding: '8px 18px', fontSize: '13px', marginBottom: '8px' }}
          >
            <Edit3 size={13} />
            Edit profile
          </button>
        </div>

        {/* User info */}
        <div style={{ padding: '12px 20px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-light)', margin: '0 0 2px', letterSpacing: '-0.3px' }}>
            {user.fullName}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 10px' }}>
            @{user.username}
          </p>
          {user.bio && (
            <p style={{ fontSize: '14px', color: 'var(--text-medium)', lineHeight: '1.5', margin: '0 0 12px' }}>
              {user.bio}
            </p>
          )}

          {/* Stats */}
          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { label: 'Following', value: user._count?.following ?? 0 },
              { label: 'Followers', value: user._count?.followers ?? 0 },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', gap: '4px', alignItems: 'baseline' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-light)' }}>{value}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Redis Cache Badge ── */}
      <div style={{
        padding: '10px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'rgba(118, 0, 49, 0.05)',
      }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
          Cache status:
        </span>
        {cacheSource === 'cache' ? (
          <span className="badge badge-success">
            <Zap size={10} /> Redis Hit
          </span>
        ) : (
          <span className="badge badge-warn">
            <Database size={10} /> DB Miss
          </span>
        )}
        <button
          onClick={fetchMyThreads}
          style={{
            background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)',
            padding: '2px 8px', borderRadius: 'var(--radius-pill)',
            fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--sans)',
          }}
        >
          Refresh
        </button>
        <p style={{ fontSize: '11px', color: 'var(--text-faint)', margin: 0, width: '100%', lineHeight: '1.5' }}>
          First load / after post → <strong>DB Miss</strong> (saved to Redis). 
          Refresh within 60s → <strong>Cache Hit</strong> (served from Redis).
        </p>
      </div>

      {/* ── Threads tab header ── */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        <Grid3x3 size={14} color="var(--accent)" />
        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-light)' }}>
          My Threads
        </span>
      </div>

      {/* ── Thread list ── */}
      {loading ? (
        <div style={{ padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div className="spinner" />
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading…</span>
        </div>
      ) : myThreads.length === 0 ? (
        <div style={{ padding: '80px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: 0 }}>
            You haven't posted yet.
          </p>
        </div>
      ) : (
        myThreads.map((thread) => <ThreadCard key={thread.id} thread={thread} />)
      )}

      {/* ── Edit Profile Modal ── */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '16px',
          }}
        >
          <div
            className="glass fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '460px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            }}
          >
            {/* Modal header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 20px', borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-light)' }}>
                Edit Profile
              </span>
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={18} color="var(--text-muted)" />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSaveProfile}>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Avatar selector */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div
                    onClick={() => avatarInputRef.current?.click()}
                    style={{ position: 'relative', cursor: 'pointer' }}
                  >
                    <img
                      src={avatarPreview || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`}
                      alt="Avatar preview"
                      style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        objectFit: 'cover', border: '2px solid var(--accent)',
                      }}
                    />
                    <div style={{
                      position: 'absolute', bottom: '0', right: '0',
                      width: '26px', height: '26px', borderRadius: '50%',
                      backgroundColor: 'var(--accent)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      border: '2px solid var(--bg-card)',
                    }}>
                      <Camera size={12} color="white" />
                    </div>
                  </div>
                  <input type="file" accept="image/*" ref={avatarInputRef} style={{ display: 'none' }} onChange={handleAvatarChange} />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tap to change photo</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-medium)' }}>Full Name</label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-medium)' }}>Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm((p) => ({ ...p, bio: e.target.value }))}
                    className="form-input"
                    rows={3}
                    placeholder="Write something about yourself…"
                    style={{ resize: 'none' }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div style={{
                display: 'flex', justifyContent: 'flex-end', gap: '10px',
                padding: '14px 20px', borderTop: '1px solid var(--border)',
              }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-ghost"
                  style={{ padding: '8px 16px', fontSize: '14px', color: 'var(--text-light)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-primary"
                  style={{ padding: '8px 20px', fontSize: '14px' }}
                >
                  {updating ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
