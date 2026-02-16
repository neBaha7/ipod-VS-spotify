import React, { useEffect } from 'react';
import styles from './Screen.module.css';
import { usePlaylist } from '../../context/PlaylistContext';

const PlaylistsScreen = ({ selectedIndex, onUpdateMenu }) => {
    const { playlists } = usePlaylist();

    useEffect(() => {
        const items = [
            { label: '+ New Playlist', id: 'create_playlist', type: 'action', action: 'createPlaylist' },
            ...playlists.map(pl => ({
                label: pl.name,
                id: pl.id,
                type: 'app',
                sublabel: `${pl.tracks.length} song${pl.tracks.length !== 1 ? 's' : ''}`
            }))
        ];
        onUpdateMenu('playlists', items);
    }, [playlists, onUpdateMenu]);

    return (
        <div className={styles.mainContent}>
            <div className={styles.header}>Playlists</div>
            {playlists.length === 0 ? (
                <ul className={styles.menuList}>
                    <li className={0 === selectedIndex ? styles.active : ''}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 16 }}>+</span>
                            <span style={{ fontWeight: '600', fontSize: 13 }}>New Playlist</span>
                        </div>
                    </li>
                    <li style={{ padding: '16px 10px', textAlign: 'center', color: '#888', fontSize: 12 }}>
                        No playlists yet. Create one!
                    </li>
                </ul>
            ) : (
                <ul className={styles.menuList}>
                    <li className={0 === selectedIndex ? styles.active : ''}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 16 }}>+</span>
                            <span style={{ fontWeight: '600', fontSize: 13 }}>New Playlist</span>
                        </div>
                    </li>
                    {playlists.map((pl, index) => (
                        <li
                            key={pl.id}
                            className={index + 1 === selectedIndex ? styles.active : ''}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <span style={{ fontWeight: '600', fontSize: 13 }}>{pl.name}</span>
                                <span style={{ fontSize: 11, opacity: 0.6 }}>
                                    {pl.tracks.length} ▸
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PlaylistsScreen;
