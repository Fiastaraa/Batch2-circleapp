import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';

export default function Follows() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState(0); // 0 = Followers, 1 = Following
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFollowData = async (tabIndex) => {
    setLoading(true);
    const type = tabIndex === 0 ? 'followers' : 'following';
    try {
      const res = await api.get(`/users/follows?type=${type}`);
      if (tabIndex === 0) {
        setFollowers(res.data);
      } else {
        setFollowing(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFollowData(activeTab);
    }
  }, [user, activeTab]);

  const handleFollowToggle = async (targetId, listType, index) => {
    try {
      const res = await api.post(`/users/${targetId}/follow`);
      
      if (listType === 'followers') {
        setFollowers((prev) => {
          const copy = [...prev];
          copy[index] = { ...copy[index], isFollowed: res.data.followed };
          return copy;
        });
      } else {
        setFollowing((prev) => {
          const copy = [...prev];
          copy[index] = { ...copy[index], isFollowed: res.data.followed };
          return copy;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const list = activeTab === 0 ? followers : following;

  return (
    <div style={{ width: '100%', backgroundColor: '#15090b', minHeight: '100vh' }}>
      {/* Header */}
      <div className="glass-header" style={{ padding: '16px 24px', textAlign: 'left' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-light)', margin: 0 }}>
          Follows
        </h2>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Custom Tab Headers */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab(0)}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 0 ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === 0 ? 'var(--accent)' : 'var(--text-muted)',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
              transition: 'all 0.2s',
            }}
          >
            Followers
          </button>
          <button
            onClick={() => setActiveTab(1)}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 1 ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === 1 ? 'var(--accent)' : 'var(--text-muted)',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
              transition: 'all 0.2s',
            }}
          >
            Following
          </button>
        </div>

        {/* Tab Panel List */}
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--accent)' }}>
              Loading follows list...
            </div>
          ) : list.length === 0 ? (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
                {activeTab === 0 ? 'Belum ada yang memfollow Anda.' : 'Anda belum memfollow siapapun.'}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {list.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(79, 37, 46, 0.15)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
                    <img
                      src={item.avatar ? `http://localhost:7001${item.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${item.fullName}`}
                      alt={item.fullName}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        backgroundColor: 'var(--accent)',
                      }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-light)' }}>
                        {item.fullName}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        @{item.username}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollowToggle(item.id, activeTab === 0 ? 'followers' : 'following', index)}
                    style={{
                      backgroundColor: item.isFollowed ? 'transparent' : 'var(--accent)',
                      color: item.isFollowed ? 'var(--text-light)' : 'var(--bg-darkest)',
                      border: item.isFollowed ? '1px solid var(--border-light)' : 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'var(--sans)',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.85'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    {item.isFollowed ? 'Following' : activeTab === 0 ? 'Follow back' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
