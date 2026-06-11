import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { UserPlus, UserCheck, Users } from 'lucide-react';

export default function Follows() {
  const { user }   = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0); // 0 = Followers, 1 = Following
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading]     = useState(false);

  const fetchFollowData = async (tabIndex) => {
    setLoading(true);
    const type = tabIndex === 0 ? 'followers' : 'following';
    try {
      const res = await api.get(`/users/follows?type=${type}`);
      if (tabIndex === 0) setFollowers(res.data);
      else                setFollowing(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) fetchFollowData(activeTab); }, [user, activeTab]);

  const handleFollowToggle = async (targetId, listType, index) => {
    try {
      const res = await api.post(`/users/${targetId}/follow`);
      const updater = (prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], isFollowed: res.data.followed };
        return copy;
      };
      if (listType === 'followers') setFollowers(updater);
      else                          setFollowing(updater);
    } catch (err) {
      console.error(err);
    }
  };

  const list = activeTab === 0 ? followers : following;

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-darkest)' }}>

      {/* ── Header ── */}
      <div className="glass-header" style={{ padding: '0 20px' }}>
        {/* Tab header inside sticky bar */}
        <div style={{ display: 'flex' }}>
          {['Followers', 'Following'].map((label, idx) => (
            <button
              key={label}
              onClick={() => setActiveTab(idx)}
              style={{
                flex: 1,
                padding: '16px 0',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === idx
                  ? '2.5px solid var(--accent)'
                  : '2.5px solid transparent',
                color: activeTab === idx ? 'var(--text-light)' : 'var(--text-muted)',
                fontSize: '14px',
                fontWeight: activeTab === idx ? '700' : '500',
                cursor: 'pointer',
                fontFamily: 'var(--sans)',
                transition: 'var(--transition)',
                letterSpacing: '0.2px',
              }}
            >
              {label}
              {idx === 0 && user?._count?.followers !== undefined && (
                <span style={{
                  marginLeft: '6px',
                  fontSize: '12px',
                  color: activeTab === 0 ? 'var(--accent)' : 'var(--text-faint)',
                  fontWeight: '600',
                }}>
                  {user._count.followers}
                </span>
              )}
              {idx === 1 && user?._count?.following !== undefined && (
                <span style={{
                  marginLeft: '6px',
                  fontSize: '12px',
                  color: activeTab === 1 ? 'var(--accent)' : 'var(--text-faint)',
                  fontWeight: '600',
                }}>
                  {user._count.following}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── List ── */}
      <div>
        {loading ? (
          <div style={{ padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div className="spinner" />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading…</span>
          </div>
        ) : list.length === 0 ? (
          <div style={{ padding: '80px 24px', textAlign: 'center' }}>
            <Users size={36} color="var(--text-faint)" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: 0 }}>
              {activeTab === 0 ? 'No followers yet' : 'Not following anyone yet'}
            </p>
          </div>
        ) : (
          list.map((item, index) => (
            <div
              key={item.id}
              className="fade-in"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 20px',
                borderBottom: '1px solid var(--border)',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,227,227,0.02)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, overflow: 'hidden' }}>
                <img
                  src={item.avatar ? `http://localhost:7001${item.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${item.fullName}`}
                  alt={item.fullName}
                  className="avatar-ring"
                  style={{ width: '44px', height: '44px', flexShrink: 0 }}
                />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-light)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.fullName}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    @{item.username}
                  </div>
                  {item.bio && (
                    <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.bio}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleFollowToggle(item.id, activeTab === 0 ? 'followers' : 'following', index)}
                style={{
                  flexShrink: 0,
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: item.isFollowed ? '1.5px solid var(--border-strong)' : 'none',
                  backgroundColor: item.isFollowed ? 'transparent' : 'var(--primary)',
                  color: item.isFollowed ? 'var(--text-muted)' : 'var(--text-light)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  display: 'flex', alignItems: 'center', gap: '5px',
                  fontFamily: 'var(--sans)',
                  marginLeft: '12px',
                }}
              >
                {item.isFollowed
                  ? <><UserCheck size={13} /> Following</>
                  : activeTab === 0
                    ? <><UserPlus size={13} /> Follow back</>
                    : <><UserPlus size={13} /> Follow</>
                }
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
