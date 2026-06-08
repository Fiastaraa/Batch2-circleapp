import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLikeState } from '../store/threadSlice';
import api from '../services/api';
import { Heart, MessageSquare, Share2 } from 'lucide-react';

export default function ThreadCard({ thread }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert('Harap login terlebih dahulu untuk menyukai thread!');
      return;
    }

    try {
      // 1. Optimistic Update di Redux
      dispatch(toggleLikeState({ threadId: thread.id, currentUserId: user.id }));

      // 2. Kirim request ke API
      await api.post(`/threads/${thread.id}/like`);
    } catch (err) {
      console.error(err);
      // Revert jika gagal
      dispatch(toggleLikeState({ threadId: thread.id, currentUserId: user.id }));
    }
  };

  const handleCardClick = () => {
    navigate(`/thread/${thread.id}`);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="fade-in hover-scale"
      onClick={handleCardClick}
      style={{
        backgroundColor: 'rgba(79, 37, 46, 0.3)',
        border: '1px solid var(--border-light)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
      }}
    >
      {/* Avatar */}
      <img
        src={thread.user?.avatar ? `http://localhost:7001${thread.user.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${thread.user?.fullName}`}
        alt={thread.user?.fullName}
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/profile`);
        }}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1.5px solid var(--accent)',
          backgroundColor: 'var(--accent)',
        }}
      />

      {/* Content wrapper */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-light)' }}>
            {thread.user?.fullName}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            @{thread.user?.username}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>•</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {formatTime(thread.createdAt)}
          </span>
        </div>

        {/* Content Text */}
        <p style={{ fontSize: '15px', color: 'var(--text-light)', margin: 0, whiteSpace: 'pre-wrap', lineHeight: '145%' }}>
          {thread.content}
        </p>

        {/* Image Attachment */}
        {thread.image && (
          <div
            style={{
              borderRadius: '8px',
              overflow: 'hidden',
              maxHeight: '380px',
              width: '100%',
              marginTop: '8px',
              border: '1px solid var(--border-light)',
            }}
          >
            <img
              src={`http://localhost:7001${thread.image}`}
              alt="Thread Media"
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '380px',
                objectFit: 'cover',
              }}
            />
          </div>
        )}

        {/* Interaction Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '8px' }}>
          {/* Like */}
          <div
            onClick={handleLike}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              color: thread.isLiked ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'color 0.2s',
            }}
          >
            <Heart size={18} fill={thread.isLiked ? 'var(--accent)' : 'none'} color={thread.isLiked ? 'var(--accent)' : 'var(--text-muted)'} />
            <span style={{ fontSize: '13px', fontWeight: '600' }}>
              {thread._count?.likes || 0}
            </span>
          </div>

          {/* Reply */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
            }}
          >
            <MessageSquare size={18} color="var(--text-muted)" />
            <span style={{ fontSize: '13px' }}>
              {thread._count?.replies || 0}
            </span>
          </div>

          {/* Share */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(`http://localhost:7001/thread/${thread.id}`);
              alert('Link detail thread disalin ke clipboard!');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <Share2 size={18} color="var(--text-muted)" />
            <span style={{ fontSize: '12px' }}>Bagikan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
