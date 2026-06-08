import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addReplyState } from '../store/threadSlice';
import api from '../services/api';
import ThreadCard from '../components/ThreadCard';
import ReplyCard from '../components/ReplyCard';
import { ArrowLeft, Send } from 'lucide-react';

export default function ThreadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchThreadDetail = async () => {
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

  useEffect(() => {
    fetchThreadDetail();
  }, [id]);

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      alert('Isi balasan tidak boleh kosong!');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/threads/${id}/reply`, { content: replyContent });
      const newReply = res.data.reply;
      setReplies((prev) => [...prev, newReply]);
      dispatch(addReplyState({ threadId: id, reply: newReply }));
      setReplyContent('');
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal membalas thread.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#15090b', minHeight: '100vh' }}>
      {/* Header */}
      <div
        className="glass-header"
        style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <button
          onClick={() => navigate(-1)}
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
            color: 'var(--text-light)',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 227, 227, 0.05)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-light)', margin: 0 }}>
          Thread
        </h2>
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--accent)' }}>
            Loading thread detail...
          </div>
        ) : !thread ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Thread tidak ditemukan.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ThreadCard thread={thread} />

            {/* Reply Input Form */}
            {user && (
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'rgba(79, 37, 46, 0.1)',
                }}
              >
                <form onSubmit={handleSubmitReply}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img
                      src={user.avatar ? `http://localhost:7001${user.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`}
                      alt={user.fullName}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1.5px solid var(--accent)',
                        backgroundColor: 'var(--accent)',
                      }}
                    />
                    <input
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Balas thread ini..."
                      style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'var(--text-light)',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'var(--sans)',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                      }}
                    >
                      <Send size={12} />
                      <span>{submitting ? 'Balas...' : 'Reply'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Replies List */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                borderTop: '1px solid var(--border-light)',
                paddingTop: '12px',
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-muted)',
                  padding: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Replies
              </span>
              {replies.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Belum ada balasan. Tulis komentar pertama!
                  </span>
                </div>
              ) : (
                replies.map((reply) => <ReplyCard key={reply.id} reply={reply} />)
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
