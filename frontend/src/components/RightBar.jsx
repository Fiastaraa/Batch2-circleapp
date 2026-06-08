import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { Database, UserPlus, UserCheck } from 'lucide-react';

export default function RightBar() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await api.get('/users/search?query=');
        const filtered = res.data.filter((u) => u.id !== user?.id).slice(0, 4);
        setSuggestions(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSuggestions();
    }
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
    <div
      style={{
        width: '320px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        borderLeft: '1px solid var(--border-light)',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        backgroundColor: '#15090b',
        textAlign: 'left',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Profile Card */}
        <div className="glass" style={{ padding: '16px', borderRadius: '12px' }}>
          <span style={{ fontSize: '15px', fontWeight: 'bold', display: 'block', marginBottom: '12px', color: 'var(--text-light)' }}>
            My Profile
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={user.avatar ? `http://localhost:7001${user.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`}
              alt={user.fullName}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid var(--accent)',
                backgroundColor: 'var(--accent)',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-light)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.fullName}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                @{user.username}
              </span>
            </div>
          </div>
          {user.bio && (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px', lineHeight: '135%' }}>
              {user.bio}
            </p>
          )}
          <button
            onClick={() => navigate('/profile')}
            style={{
              marginTop: '16px',
              width: '100%',
              backgroundColor: 'transparent',
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(36, 177, 177, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Edit Profile
          </button>
        </div>

        {/* Suggestions Card */}
        <div
          style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(79, 37, 46, 0.2)',
            border: '1px solid var(--border-light)',
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '16px', color: 'var(--text-light)' }}>
            Suggested for you
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading ? (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Loading suggestions...</div>
            ) : suggestions.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No suggestions found</div>
            ) : (
              suggestions.map((item, index) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div
                    onClick={() => navigate(`/profile`)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', overflow: 'hidden', flex: 1 }}
                  >
                    <img
                      src={item.avatar ? `http://localhost:7001${item.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${item.fullName}`}
                      alt={item.fullName}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        backgroundColor: 'var(--accent)',
                      }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-light)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.fullName}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        @{item.username}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollowToggle(item.id, index)}
                    style={{
                      backgroundColor: item.isFollowed ? 'transparent' : 'var(--accent)',
                      color: item.isFollowed ? 'var(--text-light)' : 'var(--bg-darkest)',
                      border: item.isFollowed ? '1px solid var(--border-light)' : 'none',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'var(--sans)',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.85'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    {item.isFollowed ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
