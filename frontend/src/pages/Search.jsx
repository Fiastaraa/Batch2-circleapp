import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const { user } = useSelector((state) => state.auth);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (val) => {
    setLoading(true);
    try {
      const res = await api.get(`/users/search?query=${val}`);
      const filtered = res.data.filter((u) => u.id !== user?.id);
      setResults(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch(query);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleFollowToggle = async (targetId, index) => {
    try {
      const res = await api.post(`/users/${targetId}/follow`);
      setResults((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], isFollowed: res.data.followed };
        return copy;
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#15090b', minHeight: '100vh' }}>
      {/* Header */}
      <div className="glass-header" style={{ padding: '16px 24px', textAlign: 'left' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-light)', margin: 0 }}>
          Search
        </h2>
      </div>

      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Custom Search Input */}
          <div style={{ position: 'relative', width: '100%' }}>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '16px',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <SearchIcon size={18} color="var(--text-muted)" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari pengguna berdasarkan nama atau username..."
              className="form-input"
              style={{
                width: '100%',
                paddingLeft: '44px',
              }}
            />
          </div>

          {/* Search Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--accent)' }}>
                Loading search results...
              </div>
            ) : results.length === 0 ? (
              <div style={{ padding: '80px 0', textAlign: 'center' }}>
                <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
                  {query.trim() === '' ? 'Masukkan kata kunci pencarian.' : 'Pengguna tidak ditemukan.'}
                </span>
              </div>
            ) : (
              results.map((item, index) => (
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
                      {item.bio && (
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', marginBlockEnd: 0 }}>
                          {item.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollowToggle(item.id, index)}
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
