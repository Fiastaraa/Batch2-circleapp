import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMyThreads, fetchStart, fetchFailure } from '../store/threadSlice';
import { updateProfileSuccess } from '../store/authSlice';
import api from '../services/api';
import ThreadCard from '../components/ThreadCard';
import { Edit2, Camera, Database, Zap, X } from 'lucide-react';

export default function Profile() {
  const dispatch = useDispatch();
  const avatarInputRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { myThreads, cacheSource, loading } = useSelector((state) => state.threads);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    bio: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchMyThreads = async () => {
    dispatch(fetchStart());
    try {
      const res = await api.get('/threads/my');
      dispatch(setMyThreads({
        source: res.data.source,
        data: res.data.data
      }));
    } catch (err) {
      dispatch(fetchFailure(err.response?.data?.error || 'Gagal memuat timeline profil.'));
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyThreads();
    }
  }, [user]);

  const handleOpenEdit = () => {
    setEditForm({
      fullName: user.fullName || '',
      bio: user.bio || '',
    });
    setAvatarPreview(user.avatar ? `http://localhost:7001${user.avatar}` : null);
    setIsModalOpen(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('fullName', editForm.fullName);
      formData.append('bio', editForm.bio);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await api.put('/profile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      dispatch(updateProfileSuccess(res.data.user));
      alert('Profil berhasil diperbarui!');
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal memperbarui profil.');
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ width: '100%', backgroundColor: '#15090b', minHeight: '100vh', position: 'relative' }}>
      {/* Header */}
      <div className="glass-header" style={{ padding: '16px 24px', textAlign: 'left' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-light)', margin: 0 }}>
          Profile
        </h2>
      </div>

      {/* Profile Info Card */}
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <img
              src={user.avatar ? `http://localhost:7001${user.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`}
              alt={user.fullName}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--accent)',
                backgroundColor: 'var(--accent)',
              }}
            />
            <button
              onClick={handleOpenEdit}
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              <Edit2 size={14} />
              <span>Edit Profile</span>
            </button>
          </div>

          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-light)', margin: 0 }}>
              {user.fullName}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              @{user.username}
            </p>
            {user.bio && (
              <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '12px', marginBlockEnd: 0 }}>
                {user.bio}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '6px', fontSize: '14px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-light)' }}>{user._count?.following || 0}</span>
              <span style={{ color: 'var(--text-muted)' }}>Following</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', fontSize: '14px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-light)' }}>{user._count?.followers || 0}</span>
              <span style={{ color: 'var(--text-muted)' }}>Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* REDIS CACHING DEMO BADGE */}
      <div
        style={{
          padding: '16px 24px',
          backgroundColor: 'rgba(36, 177, 177, 0.05)',
          borderBottom: '1px solid var(--border-light)',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-light)' }}>
              Redis Cache Flow Demo:
            </span>
            {cacheSource === 'cache' ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#38a169',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                <Zap size={11} fill="white" /> Redis Cache Hit (Fast Response)
              </span>
            ) : (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#dd6b20',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                <Database size={11} /> Database Read / Cache Miss
              </span>
            )}
            <button
              onClick={fetchMyThreads}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--accent)',
                color: 'var(--accent)',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '11px',
                cursor: 'pointer',
                fontFamily: 'var(--sans)',
              }}
            >
              Refresh Feed
            </button>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: '135%' }}>
            Pertama kali load / setelah buat posting, server akan <strong>Miss</strong> (ambil dari PostgreSQL dan simpan ke Redis). 
            Jika di-refresh dalam 60 detik (TTL), server akan <strong>Hit</strong> langsung dari cache Redis (in-memory).
          </p>
        </div>
      </div>

      {/* User's Threads Feed */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        <h3
          style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'var(--text-light)',
            marginBottom: '16px',
            textAlign: 'left',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          My Threads
        </h3>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--accent)' }}>
            Loading timeline...
          </div>
        ) : myThreads.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Anda belum membuat thread apapun.
            </span>
          </div>
        ) : (
          myThreads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))
        )}
      </div>

      {/* Edit Profile Modal (Custom overlay) */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            className="glass fade-in"
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: '16px',
              color: 'var(--text-light)',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Edit Profile</span>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProfile}>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                {/* Photo profile upload */}
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    onClick={() => avatarInputRef.current?.click()}
                    style={{ position: 'relative', cursor: 'pointer', display: 'inline-block' }}
                  >
                    <img
                      src={avatarPreview || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`}
                      alt="Avatar Preview"
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--accent)',
                        backgroundColor: 'var(--accent)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: 'var(--accent)',
                        color: 'var(--bg-darkest)',
                        padding: '6px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Camera size={12} />
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={avatarInputRef}
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
                    Klik foto untuk mengubah avatar
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '500' }}>Nama Lengkap</label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '500' }}>Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                    className="form-input"
                    rows={3}
                    style={{ resize: 'none' }}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  padding: '16px 20px',
                  borderTop: '1px solid var(--border-light)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--text-light)',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-primary"
                  style={{ padding: '6px 16px', fontSize: '13px' }}
                >
                  {updating ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
