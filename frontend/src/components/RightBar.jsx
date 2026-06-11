import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { UserPlus, UserCheck, Sparkles, Edit3 } from 'lucide-react';

export default function RightBar() {
  const navigate    = useNavigate();
  const { user }    = useSelector((state) => state.auth);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchSuggestions = async () => {
      try {
        const res     = await api.get('/users/search?query=');
        const filtered = res.data.filter((u) => u.id !== user?.id).slice(0, 5);
        setSuggestions(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [user]);

  const handleFollowToggle = async (userId, index) => {
    try {
      const res = await api.post(`/users/${userId}/follow`);
      setSuggestions((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], isFollowed: res.data.followed };
        return copy;
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <aside
      style={{
        width: '320px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        padding: '28px 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        backgroundColor: 'var(--bg-sidebar)',
        borderLeft: '1px solid var(--border)',
        flexShrink: 0,
        overflowY: 'auto',
      }}
    >
      {/* ── My Profile Card ── */}
      <div style={{
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(118,0,49,0.35) 0%, rgba(42,13,20,0.8) 100%)',
        border: '1px solid var(--border-strong)',
        overflow: 'hidden',
      }}>
        {/* Cover gradient strip */}
        <div style={{
          height: '56px',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          position: 'relative',
        }} />

        {/* Avatar + info */}
        <div style={{ padding: '0 16px 16px' }}>
          <img
            src={user.avatar ? `http://localhost:7001${user.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`}
            alt={user.fullName}
            className="avatar-ring"
            style={{
              width: '56px',
              height: '56px',
              marginTop: '-28px',
              border: '3px solid var(--bg-darkest)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}
          />

          <div style={{ marginTop: '8px' }}>
            <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-light)' }}>
              {user.fullName}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '1px' }}>
              @{user.username}
            </div>
            {user.bio && (
              <p style={{ fontSize: '12px', color: 'var(--text-medium)', marginTop: '8px', lineHeight: '1.45', marginBottom: 0 }}>
                {user.bio}
              </p>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
            {[
              { label: 'Following', value: user._count?.following ?? 0 },
              { label: 'Followers', value: user._count?.followers ?? 0 },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-light)' }}>{value}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>{label}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="btn-secondary"
            style={{ width: '100%', marginTop: '12px', padding: '8px', fontSize: '13px' }}
          >
            <Edit3 size={13} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* ── Suggested For You ── */}
      <div style={{
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        backgroundColor: 'rgba(42, 13, 20, 0.5)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <Sparkles size={14} color="var(--accent)" />
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-light)' }}>
            Suggested for you
          </span>
        </div>

        <div style={{ padding: '8px 0' }}>
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div className="spinner" style={{ margin: '0 auto' }} />
            </div>
          ) : suggestions.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
              No suggestions
            </div>
          ) : (
            suggestions.map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '10px 16px',
                  transition: 'var(--transition)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,227,227,0.03)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, overflow: 'hidden' }}>
                  <img
                    src={item.avatar ? `http://localhost:7001${item.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${item.fullName}`}
                    alt={item.fullName}
                    className="avatar-ring"
                    style={{ width: '36px', height: '36px', flexShrink: 0 }}
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--text-light)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {item.fullName}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      @{item.username}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); handleFollowToggle(item.id, index); }}
                  style={{
                    flexShrink: 0,
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: item.isFollowed ? '1.5px solid var(--border-strong)' : 'none',
                    backgroundColor: item.isFollowed ? 'transparent' : 'var(--primary)',
                    color: item.isFollowed ? 'var(--text-muted)' : 'var(--text-light)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontFamily: 'var(--sans)',
                  }}
                >
                  {item.isFollowed
                    ? <><UserCheck size={11} /> Following</>
                    : <><UserPlus  size={11} /> Follow</>
                  }
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ fontSize: '11px', color: 'var(--text-faint)', lineHeight: '1.6', paddingLeft: '4px' }}>
        Circle · threads-style app<br />
        Built with ❤ by Fiastara
      </div>
    </aside>
  );
}
