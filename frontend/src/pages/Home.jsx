import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setThreads, addThread, fetchStart, fetchFailure } from '../store/threadSlice';
import api from '../services/api';
import ThreadCard from '../components/ThreadCard';
import io from 'socket.io-client';
import { ImageIcon, Send, X } from 'lucide-react';

export default function Home() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { threads, loading } = useSelector((state) => state.threads);

  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchFeed = async () => {
    dispatch(fetchStart());
    try {
      const res = await api.get('/threads');
      dispatch(setThreads(res.data));
    } catch (err) {
      dispatch(fetchFailure(err.response?.data?.error || 'Gagal memuat feed!'));
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:7001');

    socket.on('threadCreated', (newThread) => {
      console.log('[WebSocket Client] Thread baru dideteksi:', newThread);
      dispatch((dispatchState, getState) => {
        const currentThreads = getState().threads.threads;
        const exists = currentThreads.some((t) => t.id === newThread.id);
        if (!exists) {
          dispatchState(addThread(newThread));
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !selectedImage) {
      alert('Thread tidak boleh kosong!');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const res = await api.post('/threads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      dispatch(addThread(res.data.thread));
      setContent('');
      handleRemoveImage();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Gagal memposting thread.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#15090b', minHeight: '100vh' }}>
      {/* Header */}
      <div className="glass-header" style={{ padding: '16px 24px', textAlign: 'left' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-light)', margin: 0 }}>
          Home
        </h2>
      </div>

      {/* Post creator form */}
      {user && (
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid var(--border-light)',
            backgroundColor: 'rgba(79, 37, 46, 0.1)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <img
                src={user.avatar ? `http://localhost:7001${user.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`}
                alt={user.fullName}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid var(--accent)',
                  backgroundColor: 'var(--accent)',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Apa yang sedang terjadi hari ini?"
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--text-light)',
                    fontSize: '15px',
                    fontFamily: 'var(--sans)',
                    outline: 'none',
                    resize: 'none',
                    minHeight: '60px',
                  }}
                />

                {/* Image Preview */}
                {imagePreview && (
                  <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', maxHeight: '250px', width: '100%' }}>
                    <img
                      src={imagePreview}
                      alt="Upload preview"
                      style={{ width: '100%', maxHeight: '250px', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 227, 227, 0.05)',
                  }}
                >
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(36, 177, 177, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <ImageIcon size={20} color="var(--accent)" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      fontSize: '13px',
                    }}
                  >
                    <Send size={14} />
                    <span>{submitting ? 'Posting...' : 'Post'}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Feed list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: '24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--accent)' }}>
            Loading feeds...
          </div>
        ) : threads.length === 0 ? (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
              Belum ada thread. Jadilah yang pertama memposting!
            </span>
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
