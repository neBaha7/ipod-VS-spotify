import React, { useEffect, useState } from 'react';
import styles from './Screen.module.css';
import { searchYouTube } from '../../services/youtube';

const SearchScreen = ({ selectedIndex, onUpdateMenu }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const doSearch = (q) => {
        setLoading(true);
        // Reset menu items so we validly "loading" state? 
        // Or just keep old items until new ones load.
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
        });
    }

    useEffect(() => {
        doSearch('popular'); // Initial load
    }, []); // Only on mount

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            doSearch(query);
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
                <div style={{ padding: 20 }}>Loading...</div>
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
