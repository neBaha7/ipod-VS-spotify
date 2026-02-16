import React, { useEffect, useState } from 'react';
import styles from './Screen.module.css';
import { usePlaylist } from '../../context/PlaylistContext';

const AddToPlaylistScreen = ({ selectedIndex, onUpdateMenu, onGoBack }) => {
    const { playlists, pendingTrack, addToPlaylist, createPlaylist, setPendingTrack } = usePlaylist();
    const [creatingNew, setCreatingNew] = useState(false);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        if (creatingNew) return; // Don't update menu while creating
        const items = [
            { label: '+ New Playlist', id: 'new_playlist_inline', type: 'action', action: 'newPlaylistInline' },
            ...playlists.map(pl => ({
                label: pl.name,
                id: pl.id,
                type: 'action',
                action: 'pickPlaylist',
                sublabel: `${pl.tracks.length} song${pl.tracks.length !== 1 ? 's' : ''}`
            }))
        ];
        onUpdateMenu('addToPlaylist', items);
    }, [playlists, onUpdateMenu, creatingNew]);

    const handlePickPlaylist = (playlistId) => {
        if (!pendingTrack) return;
        addToPlaylist(playlistId, pendingTrack);
        setPendingTrack(null);
        onGoBack();
    };

    const handleCreateAndAdd = () => {
        if (!newName.trim()) return;
        const pl = createPlaylist(newName.trim());
        if (pendingTrack) {
            addToPlaylist(pl.id, pendingTrack);
            setPendingTrack(null);
        }
        setCreatingNew(false);
        setNewName('');
        onGoBack();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCreateAndAdd();
        }
    };

    // Expose handlers to parent via a global ref approach or just handle internally
    // For the iPod UX: selecting a list item is handled by useMenu which calls our action handlers
    // But we need to intercept the action. We'll use the onUpdateMenu + action type approach.

    if (creatingNew) {
        return (
            <div className={styles.mainContent}>
                <div className={styles.header}>New Playlist</div>
                <div style={{ padding: 10 }}>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Playlist name..."
                        autoFocus
                        style={{
                            width: '100%',
                            border: '1px solid #ccc',
                            borderRadius: 4,
                            padding: '6px 8px',
                            fontSize: 13,
                            outline: 'none',
                            background: '#fff',
                            color: '#000'
                        }}
                    />
                    <div style={{
                        marginTop: 8,
                        fontSize: 11,
                        color: '#888',
                        textAlign: 'center'
                    }}>
                        Type a name and press Enter
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.mainContent}>
            <div className={styles.header}>Add to Playlist</div>
            {pendingTrack && (
                <div style={{
                    padding: '4px 10px',
                    fontSize: 11,
                    color: '#666',
                    borderBottom: '1px solid #eee',
                    background: '#f8f8f8'
                }}>
                    Adding: <strong>{pendingTrack.title}</strong>
                </div>
            )}
            <ul className={styles.menuList}>
                <li
                    className={0 === selectedIndex ? styles.active : ''}
                    style={{ cursor: 'pointer' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 16 }}>+</span>
                        <span style={{ fontWeight: '600', fontSize: 13 }}>New Playlist</span>
                    </div>
                </li>
                {playlists.map((pl, index) => (
                    <li
                        key={pl.id}
                        className={index + 1 === selectedIndex ? styles.active : ''}
                        style={{ cursor: 'pointer' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <span style={{ fontWeight: '600', fontSize: 13 }}>{pl.name}</span>
                            <span style={{ fontSize: 11, opacity: 0.6 }}>
                                {pl.tracks.length}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AddToPlaylistScreen;
