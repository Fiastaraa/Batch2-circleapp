import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { Search as SearchIcon, UserPlus, UserCheck } from 'lucide-react';

export default function Search() {
  const { user }   = useSelector((state) => state.auth);
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (val) => {
    setLoading(true);
    try {
      const res      = await api.get(`/users/search?query=${val}`);
      const filtered = res.data.filter((u) => u.id !== user?.id);
      setResults(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => handleSearch(query), 400);
    return () => clearTimeout(t);
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
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-darkest)' }}>

      {/* ── Header ── */}
      <div className="glass-header" style={{ padding: '16px 20px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-light)', margin: 0, letterSpacing: '-0.3px' }}>
          Search
        </h2>
      </div>

      <div style={{ padding: '16px 20px' }}>

        {/* Search input */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <SearchIcon
            size={16}
            color="var(--text-muted)"
            style={{
              position: 'absolute', left: '14px', top: '50%',
              transform: 'translateY(-50%)', pointerEvents: 'none',
            }}
          />
          <input
            id="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or username…"
            className="form-input"
            style={{ paddingLeft: '40px', borderRadius: 'var(--radius-pill)' }}
            autoFocus
          />
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div className="spinner" />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Searching…</span>
          </div>
        ) : results.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <SearchIcon size={36} color="var(--text-faint)" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: 0 }}>
              {query.trim() === '' ? 'Start typing to find people' : `No results for "${query}"`}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {results.map((item, index) => (
              <div
                key={item.id}
                className="fade-in"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  transition: 'var(--transition)',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,227,227,0.03)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
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
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>@{item.username}</div>
                    {item.bio && (
                      <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.bio}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleFollowToggle(item.id, index)}
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
                    : <><UserPlus  size={13} /> Follow</>
                  }
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
