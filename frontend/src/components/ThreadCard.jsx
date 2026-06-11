import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLikeState } from '../store/threadSlice';
import api from '../services/api';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

export default function ThreadCard({ thread }) {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { user }  = useSelector((state) => state.auth);
  const [shareMsg, setShareMsg] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) { alert('Harap login terlebih dahulu!'); return; }
    dispatch(toggleLikeState({ threadId: thread.id, currentUserId: user.id }));
    try {
      await api.post(`/threads/${thread.id}/like`);
    } catch (err) {
      console.error(err);
      dispatch(toggleLikeState({ threadId: thread.id, currentUserId: user.id }));
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/thread/${thread.id}`);
    setShareMsg(true);
    setTimeout(() => setShareMsg(false), 2000);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now   = new Date();
    const diff  = (now - date) / 1000; // seconds
    if (diff < 60)   return `${Math.floor(diff)}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400)return `${Math.floor(diff / 3600)}h`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const isLiked    = thread.isLiked;
  const likeCount  = thread._count?.likes  ?? 0;
  const replyCount = thread._count?.replies ?? 0;

  return (
    <article
      className="fade-in"
      onClick={() => navigate(`/thread/${thread.id}`)}
      style={{
        display: 'flex',
        gap: '12px',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'var(--transition)',
        position: 'relative',
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,227,227,0.02)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {/* ── Avatar column ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <img
          src={thread.user?.avatar
            ? `http://localhost:7001${thread.user.avatar}`
            : `https://api.dicebear.com/7.x/initials/svg?seed=${thread.user?.fullName}`}
          alt={thread.user?.fullName}
          className="avatar-ring"
          onClick={(e) => { e.stopPropagation(); navigate('/profile'); }}
          style={{ width: '40px', height: '40px', cursor: 'pointer' }}
        />

        {/* Thread line (Threads-style) */}
        {replyCount > 0 && (
          <div style={{
            width: '2px',
            flex: 1,
            minHeight: '20px',
            marginTop: '6px',
            background: 'linear-gradient(to bottom, var(--border-strong) 0%, transparent 100%)',
            borderRadius: '2px',
          }} />
        )}
      </div>

      {/* ── Content column ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
          <span
            onClick={(e) => { e.stopPropagation(); navigate('/profile'); }}
            style={{
              fontSize: '14px',
              fontWeight: '700',
              color: 'var(--text-light)',
              cursor: 'pointer',
              lineHeight: '1',
            }}
          >
            {thread.user?.fullName}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>@{thread.user?.username}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-faint)' }}>·</span>
          <span style={{ fontSize: '12px', color: 'var(--text-faint)', marginLeft: 'auto' }}>
            {formatTime(thread.createdAt)}
          </span>
        </div>

        {/* Text content */}
        {thread.content && (
          <p style={{
            fontSize: '15px',
            color: 'var(--text-light)',
            lineHeight: '1.5',
            margin: '0 0 10px 0',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {thread.content}
          </p>
        )}

        {/* Image */}
        {thread.image && (
          <div style={{
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            marginBottom: '12px',
            border: '1px solid var(--border)',
            maxHeight: '400px',
          }}>
            <img
              src={`http://localhost:7001${thread.image}`}
              alt="Thread media"
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {/* Actions row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>

          {/* Like */}
          <button
            onClick={handleLike}
            className="btn-ghost"
            style={{
              gap: '5px',
              color: isLiked ? 'var(--like-color)' : 'var(--text-muted)',
              padding: '6px 8px',
            }}
          >
            <Heart
              size={18}
              fill={isLiked ? 'var(--like-color)' : 'none'}
              color={isLiked ? 'var(--like-color)' : 'currentColor'}
              style={{ transition: 'transform 0.15s', transform: isLiked ? 'scale(1.15)' : 'scale(1)' }}
            />
            <span style={{ fontSize: '13px', fontWeight: '500' }}>{likeCount}</span>
          </button>

          {/* Reply */}
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/thread/${thread.id}`); }}
            className="btn-ghost"
            style={{ gap: '5px', padding: '6px 8px' }}
          >
            <MessageCircle size={18} />
            <span style={{ fontSize: '13px', fontWeight: '500' }}>{replyCount}</span>
          </button>

          {/* Share */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleShare}
              className="btn-ghost"
              style={{ gap: '5px', padding: '6px 8px', color: shareMsg ? 'var(--accent)' : 'var(--text-muted)' }}
            >
              <Share2 size={18} />
            </button>
            {shareMsg && (
              <div style={{
                position: 'absolute',
                bottom: '110%',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 8px',
                fontSize: '11px',
                color: 'var(--accent)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                animation: 'fadeIn 0.2s ease',
              }}>
                Copied!
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
