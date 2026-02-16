import React, { useEffect } from 'react';
import styles from './Screen.module.css';
import { usePlaylist } from '../../context/PlaylistContext';

const PlaylistDetailScreen = ({ playlistId, selectedIndex, onUpdateMenu }) => {
    const { getPlaylist } = usePlaylist();
    const playlist = getPlaylist(playlistId);

    useEffect(() => {
        if (!playlist) return;
        const menuId = 'playlist_detail_' + playlistId;
        const items = playlist.tracks.map(track => ({
            ...track,
            type: 'track',
            label: track.title,
            id: track.id
        }));
        onUpdateMenu(menuId, items);
    }, [playlist, playlistId, onUpdateMenu]);

    if (!playlist) {
        return (
            <div className={styles.mainContent}>
                <div className={styles.header}>Playlist</div>
                <div style={{ padding: 20, textAlign: 'center', color: '#666', fontSize: 13 }}>
                    Playlist not found.
                </div>
            </div>
        );
    }

    return (
        <div className={styles.mainContent}>
            <div className={styles.header}>{playlist.name}</div>
            {playlist.tracks.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: '#666', fontSize: 13 }}>
                    No songs yet.<br />Search for songs and add them!
                </div>
            ) : (
                <ul className={styles.menuList}>
                    {playlist.tracks.map((item, index) => (
                        <li key={item.id} className={index === selectedIndex ? styles.active : ''}>
                            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <span style={{
                                    fontWeight: '600',
                                    fontSize: '12px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
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

export default PlaylistDetailScreen;
