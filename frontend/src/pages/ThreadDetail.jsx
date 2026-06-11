import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addReplyState } from '../store/threadSlice';
import api from '../services/api';
import ThreadCard from '../components/ThreadCard';
import ReplyCard from '../components/ReplyCard';
import io from 'socket.io-client';
import { ArrowLeft, Send, MessageCircle, ImageIcon, X } from 'lucide-react';

export default function ThreadDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const { user }   = useSelector((state) => state.auth);

  const [thread, setThread]           = useState(null);
  const [replies, setReplies]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview]   = useState(null);
  const [submitting, setSubmitting]   = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const res = await api.get(`/threads/${id}`);
        setThread(res.data);
        setReplies(res.data.replies || []);
      } catch (err) {
        alert(err.response?.data?.error || 'Thread tidak ditemukan.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchThread();
  }, [id]);

  useEffect(() => {
    const socket = io('http://localhost:7001');
    socket.on('replyCreated', (newReply) => {
      if (newReply.threadId === id) {
        setReplies((prev) => {
          if (!prev.some((r) => r.id === newReply.id)) {
            dispatch(addReplyState({ threadId: id, reply: newReply }));
            return [...prev, newReply];
          }
          return prev;
        });
      }
    });
    return () => socket.disconnect();
  }, [id, dispatch]);

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

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() && !selectedImage) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', replyContent);
      if (selectedImage) formData.append('image', selectedImage);

      const res      = await api.post(`/threads/${id}/reply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Karena WebSocket akan menerima replyCreated, kita tidak perlu set manual lagi jika kita ingin menunggu WS.
      // Namun untuk UI yang snappy, biarkan manual set di sini (WebSocket effect ada fallback .some() untuk mencegah duplikat).
      const newReply = res.data.reply;
      setReplies((prev) => {
        if (!prev.some(r => r.id === newReply.id)) {
          dispatch(addReplyState({ threadId: id, reply: newReply }));
          return [...prev, newReply];
        }
        return prev;
      });
      setReplyContent('');
      handleRemoveImage();
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal membalas thread.');
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
      <div className="glass-header" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost"
          style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}
        >
          <ArrowLeft size={20} color="var(--text-light)" />
        </button>
        <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-light)', margin: 0, letterSpacing: '-0.3px' }}>
          Thread
        </h2>
      </div>

      {loading ? (
        <div style={{ padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div className="spinner" />
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading thread…</span>
        </div>
      ) : !thread ? (
        <div style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Thread not found.
        </div>
      ) : (
        <>
          {/* Main thread */}
          <div style={{ borderBottom: '1px solid var(--border)' }}>
            <ThreadCard thread={thread} />
          </div>

          {/* ── Reply compose box ── */}
          {user && (
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              backgroundColor: 'rgba(186, 106, 76, 0.03)',
            }}>
              <img
                src={avatarSrc}
                alt={user.fullName}
                className="avatar-ring"
                style={{ width: '34px', height: '34px', flexShrink: 0 }}
              />
              <form onSubmit={handleSubmitReply} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    id="reply-input"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Reply to @${thread.user?.username}…`}
                    style={{
                      flex: 1,
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'var(--text-light)',
                      fontSize: '14px',
                      fontFamily: 'var(--sans)',
                      outline: 'none',
                    }}
                  />
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
                    style={{ color: 'var(--accent)', padding: '6px' }}
                    data-tooltip="Add image"
                  >
                    <ImageIcon size={16} />
                  </button>
                  <button
                    id="reply-submit"
                    type="submit"
                    disabled={submitting || (!replyContent.trim() && !selectedImage)}
                    className="btn-primary"
                    style={{ padding: '7px 14px', fontSize: '12px', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
                  >
                    {submitting ? '…' : <><Send size={12} /> Reply</>}
                  </button>
                </div>
                {/* Image preview */}
                {imagePreview && (
                  <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', maxWidth: '200px' }}>
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      style={{
                        position: 'absolute', top: '4px', right: '4px',
                        backgroundColor: 'rgba(0,0,0,0.7)', border: 'none',
                        borderRadius: '50%', width: '20px', height: '20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'white',
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* ── Replies list ── */}
          <div>
            <div style={{
              padding: '12px 20px 8px',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <MessageCircle size={14} color="var(--text-muted)" />
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>
                {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
              </span>
            </div>

            {replies.length === 0 ? (
              <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
                  No replies yet. Start the conversation!
                </p>
              </div>
            ) : (
              replies.map((reply) => <ReplyCard key={reply.id} reply={reply} />)
            )}
          </div>
        </>
      )}
    </div>
  );
}
