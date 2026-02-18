import React, { useEffect, useState } from 'react';
import styles from './Screen.module.css';
import { searchYouTube } from '../../services/youtube';

const SearchScreen = ({ selectedIndex, onUpdateMenu }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const doSearch = (q) => {
        setLoading(true);
        setError(null);
        searchYouTube(q).then(data => {
            setResults(data);
            setLoading(false);

            const items = data.map(track => ({
                ...track,
                type: 'track',
                label: track.title,
                id: track.id
            }));
            onUpdateMenu('search', items);
        }).catch(err => {
            setLoading(false);
            setError('Search failed. Try again.');
            console.error('Search error:', err);
        });
    }

    useEffect(() => {
        doSearch('popular music'); // Initial load
    }, []); // Only on mount

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && query.trim()) {
            doSearch(query.trim());
        }
    };

    return (
        <div className={styles.mainContent}>
            <div className={styles.header}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search YouTube..."
                    style={{
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        outline: 'none',
                        color: 'inherit'
                    }}
                    autoFocus
                />
            </div>
            {loading ? (
                <div style={{
                    flex: 1, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'column', gap: 8
                }}>
                    <div style={{
                        width: 20, height: 20,
                        border: '2px solid #ddd',
                        borderTopColor: '#4A90D9',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                    }} />
                    <div style={{ fontSize: 11, color: '#888' }}>Searching...</div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : error ? (
                <div style={{ padding: 20, textAlign: 'center', color: '#c0392b', fontSize: 12 }}>
                    {error}
                </div>
            ) : results.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: '#888', fontSize: 12 }}>
                    No results. Type a query and press Enter.
                </div>
            ) : (
                <ul className={styles.menuList}>
                    {results.map((item, index) => (
                        <li key={item.id} className={index === selectedIndex ? styles.active : ''}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: '600', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item.title}
                                </span>
                                <span style={{ fontSize: 10, opacity: 0.8 }}>{item.artist}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchScreen;
