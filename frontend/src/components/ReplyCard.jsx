import React from 'react';

export default function ReplyCard({ reply }) {
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
      className="fade-in"
      style={{
        padding: '16px',
        borderBottom: '1px solid var(--border-light)',
        backgroundColor: 'rgba(79, 37, 46, 0.15)',
        textAlign: 'left',
        width: '100%',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
      }}
    >
      <img
        src={reply.user?.avatar ? `http://localhost:7001${reply.user.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${reply.user?.fullName}`}
        alt={reply.user?.fullName}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1px solid var(--accent)',
          backgroundColor: 'var(--accent)',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-light)' }}>
            {reply.user?.fullName}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            @{reply.user?.username}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>•</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {formatTime(reply.createdAt)}
          </span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-light)', margin: 0, lineHeight: '140%' }}>
          {reply.content}
        </p>
      </div>
    </div>
  );
}
