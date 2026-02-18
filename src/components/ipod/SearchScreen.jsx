import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './Screen.module.css';
import { searchYouTube, getSuggestions } from '../../services/youtube';

const SearchScreen = ({ selectedIndex, onUpdateMenu }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceRef = useRef(null);
    const inputRef = useRef(null);

    // Debounced suggestion fetcher — fires after each keystroke with 250ms delay
    const fetchSuggestions = useCallback((q) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!q || q.trim().length === 0) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            try {
                const s = await getSuggestions(q);
                setSuggestions(s);
                setShowSuggestions(s.length > 0);
            } catch {
                setSuggestions([]);
            }
        }, 250);
    }, []);

    // Full search — executes when user picks a suggestion or presses Enter
    const doSearch = useCallback(async (q) => {
        if (!q || q.trim().length === 0) return;
        setLoading(true);
        setShowSuggestions(false);
        setSuggestions([]);

        try {
            const data = await searchYouTube(q);
            setResults(data);
            const items = data.map(track => ({
                ...track,
                type: 'track',
                label: track.title,
                id: track.id
            }));
            onUpdateMenu('search', items);
        } catch (err) {
            console.error('Search error:', err);
        }
        setLoading(false);
    }, [onUpdateMenu]);

    // Load initial results
    useEffect(() => {
        doSearch('popular music');
    }, []); // Only on mount

    // On query change → fetch suggestions
    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        fetchSuggestions(val);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && query.trim()) {
            doSearch(query.trim());
        }
    };

    // Pick a suggestion
    const pickSuggestion = (s) => {
        setQuery(s);
        setShowSuggestions(false);
        setSuggestions([]);
        doSearch(s);
    };

    return (
        <div className={styles.mainContent}>
            {/* Search input header */}
            <div className={styles.header} style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 13, opacity: 0.5 }}>🔍</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                        placeholder="Search music..."
                        style={{
                            width: '100%',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            outline: 'none',
                            color: 'inherit'
                        }}
                        autoFocus
                    />
                </div>
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div style={{
                    background: '#fffde7',
                    borderBottom: '1px solid #e0d68a',
                    maxHeight: 120,
                    overflowY: 'auto'
                }}>
                    {suggestions.map((s, i) => (
                        <div
                            key={i}
                            onClick={() => pickSuggestion(s)}
                            style={{
                                padding: '3px 10px',
                                fontSize: 12,
                                cursor: 'pointer',
                                borderBottom: '1px solid #f0e8a0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6
                            }}
                        >
                            <span style={{ fontSize: 10, opacity: 0.4 }}>🔍</span>
                            <span style={{ fontWeight: 500 }}>{s}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Results / Loading / Empty */}
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
            ) : results.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: '#888', fontSize: 12 }}>
                    No results. Type a query to search.
                </div>
            ) : (
                <ul className={styles.menuList}>
                    {results.map((item, index) => (
                        <li key={item.id} className={index === selectedIndex ? styles.active : ''}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <img
                                    src={item.thumbnail}
                                    alt=""
                                    style={{
                                        width: 28, height: 28,
                                        borderRadius: 3,
                                        objectFit: 'cover',
                                        flexShrink: 0
                                    }}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                    <span style={{
                                        fontWeight: '600', fontSize: '11px',
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                    }}>
                                        {item.title}
                                    </span>
                                    <span style={{ fontSize: 9, opacity: 0.7 }}>{item.artist}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchScreen;
