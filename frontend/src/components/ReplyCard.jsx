import React from 'react';

export default function ReplyCard({ reply }) {
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now   = new Date();
    const diff  = (now - date) / 1000;
    if (diff < 60)    return `${Math.floor(diff)}s`;
    if (diff < 3600)  return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  return (
    <div
      className="fade-in"
      style={{
        display: 'flex',
        gap: '12px',
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        transition: 'var(--transition)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,227,227,0.02)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {/* Avatar */}
      <img
        src={reply.user?.avatar
          ? `http://localhost:7001${reply.user.avatar}`
          : `https://api.dicebear.com/7.x/initials/svg?seed=${reply.user?.fullName}`}
        alt={reply.user?.fullName}
        className="avatar-ring"
        style={{ width: '34px', height: '34px', flexShrink: 0 }}
      />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-light)' }}>
            {reply.user?.fullName}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>@{reply.user?.username}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-faint)', marginLeft: 'auto' }}>
            {formatTime(reply.createdAt)}
          </span>
        </div>

        <p style={{
          fontSize: '14px',
          color: 'var(--text-medium)',
          lineHeight: '1.5',
          margin: 0,
          wordBreak: 'break-word',
        }}>
          {reply.content}
        </p>

        {/* Reply image if exists */}
        {reply.image && (
          <div style={{
            marginTop: '8px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}>
            <img
              src={`http://localhost:7001${reply.image}`}
              alt="Reply media"
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
