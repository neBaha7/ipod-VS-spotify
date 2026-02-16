import React, { useEffect } from 'react';
import styles from './Screen.module.css';
import { usePlayer } from '../../context/PlayerContext';

const FavoritesScreen = ({ selectedIndex, onUpdateMenu }) => {
    const { favorites, play } = usePlayer();

    useEffect(() => {
        // Sync favorites with menu items for navigation
        const items = favorites.map(track => ({
            ...track,
            type: 'track',
            label: track.title,
            id: track.id
        }));
        onUpdateMenu('favorites', items);
    }, [favorites, onUpdateMenu]);

    // Handle selection logic? 
    // Actually Screen.jsx or useMenu.js handles the 'select' action by calling 'onSelect'?
    // Wait, useMenu.js handles 'select' based on item type.
    // If items are type: 'track', useMenu calls 'play(item)'.
    // So as long as we push items with type 'track', selection works automatically!
    // AND passing 'id' is important.

    return (
        <div className={styles.mainContent}>
            <div className={styles.header}>Favorites</div>
            {favorites.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: '#666', fontSize: 13 }}>
                    No favorites yet.<br />Go to Now Playing and star some songs!
                </div>
            ) : (
                <ul className={styles.menuList}>
                    {favorites.map((item, index) => (
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

export default FavoritesScreen;
