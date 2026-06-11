import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setThreads, addThread, fetchStart, fetchFailure } from '../store/threadSlice';
import api from '../services/api';
import ThreadCard from '../components/ThreadCard';
import io from 'socket.io-client';
import { ImageIcon, X, Send, Flame } from 'lucide-react';

export default function Home() {
  const dispatch       = useDispatch();
  const fileInputRef   = useRef(null);
  const { user }       = useSelector((state) => state.auth);
  const { threads, loading } = useSelector((state) => state.threads);

  const [content, setContent]           = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview]   = useState(null);
  const [submitting, setSubmitting]       = useState(false);
  const [newCount, setNewCount]           = useState(0);

  // ── Fetch feed ────────────────────────────────────────────────────────────
  const fetchFeed = async () => {
    dispatch(fetchStart());
    try {
      const res = await api.get('/threads');
      dispatch(setThreads(res.data));
    } catch (err) {
      dispatch(fetchFailure(err.response?.data?.error || 'Gagal memuat feed!'));
    }
  };

  useEffect(() => { fetchFeed(); }, []);

  // ── WebSocket for real-time new threads ──────────────────────────────────
  useEffect(() => {
    const socket = io('http://localhost:7001');
    socket.on('threadCreated', (newThread) => {
      dispatch((dispatchState, getState) => {
        const current = getState().threads.threads;
        if (!current.some((t) => t.id === newThread.id)) {
          dispatchState(addThread(newThread));
          setNewCount((c) => c + 1);
        }
      });
    });
    return () => socket.disconnect();
  }, []);

  // ── Image handling ───────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Submit thread ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !selectedImage) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (selectedImage) formData.append('image', selectedImage);

      const res = await api.post('/threads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(addThread(res.data.thread));
      setContent('');
      handleRemoveImage();
      setNewCount(0);
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal memposting thread.');
    } finally {
      setSubmitting(false);
    }
  };

  const avatarSrc = user?.avatar
    ? `http://localhost:7001${user.avatar}`
    : `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`;

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-darkest)' }}>

      {/* ── Header ── */}
      <div className="glass-header" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={20} color="var(--accent)" fill="var(--accent)" />
            <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-light)', margin: 0, letterSpacing: '-0.3px' }}>
              For You
            </h2>
          </div>
          {newCount > 0 && (
            <button
              onClick={() => { setNewCount(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--primary)',
                color: 'var(--text-light)',
                border: 'none',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'var(--sans)',
                animation: 'fadeIn 0.3s ease',
              }}
            >
              {newCount} new post{newCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>

      {/* ── Compose area ── */}
      {user && (
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              {/* Avatar */}
              <img
                src={avatarSrc}
                alt={user.fullName}
                className="avatar-ring"
                style={{ width: '38px', height: '38px', flexShrink: 0, marginTop: '2px' }}
              />

              {/* Input area */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={content.length > 80 ? 4 : 2}
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--text-light)',
                    fontSize: '15px',
                    fontFamily: 'var(--sans)',
                    outline: 'none',
                    resize: 'none',
                    lineHeight: '1.5',
                    placeholder: 'color: var(--text-muted)',
                  }}
                />

                {/* Image preview */}
                {imagePreview && (
                  <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', maxHeight: '280px' }}>
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '280px', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      style={{
                        position: 'absolute', top: '8px', right: '8px',
                        backgroundColor: 'rgba(0,0,0,0.7)', border: 'none',
                        borderRadius: '50%', width: '28px', height: '28px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'white',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Action row */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: '8px', borderTop: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <input
                      type="file" accept="image/*"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-ghost"
                      style={{ color: 'var(--accent)', padding: '6px 8px' }}
                      data-tooltip="Add image"
                    >
                      <ImageIcon size={18} />
                    </button>
                    <span style={{ fontSize: '13px', color: 'var(--text-faint)' }}>
                      {content.length > 0 && `${content.length} chars`}
                    </span>
                  </div>

                  <button
                    id="post-thread-btn"
                    type="submit"
                    disabled={submitting || (!content.trim() && !selectedImage)}
                    className="btn-primary"
                    style={{ padding: '8px 18px', fontSize: '13px', borderRadius: 'var(--radius-md)' }}
                  >
                    {submitting ? 'Posting…' : (
                      <><Send size={13} /> Post</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── Thread Feed ── */}
      <div>
        {loading ? (
          <div style={{ padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div className="spinner" />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading feed…</span>
          </div>
        ) : threads.length === 0 ? (
          <div style={{ padding: '80px 24px', textAlign: 'center' }}>
            <Flame size={40} color="var(--primary)" fill="var(--primary)" style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', margin: 0 }}>
              No threads yet. Be the first to post!
            </p>
          </div>
        ) : (
          threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))
        )}
      </div>
    </div>
  );
}
