import React, { useState } from 'react';
import styles from './Screen.module.css';

import NowPlaying from './NowPlaying';
import SearchScreen from './SearchScreen';
import FavoritesScreen from './FavoritesScreen';
import QueueScreen from './QueueScreen';
import PlaylistsScreen from './PlaylistsScreen';
import PlaylistDetailScreen from './PlaylistDetailScreen';
import AddToPlaylistScreen from './AddToPlaylistScreen';

const CreatePlaylistInput = ({ onDone }) => {
    const [name, setName] = useState('');
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && name.trim()) {
            onDone(name.trim());
        }
    };
    return (
        <div className={styles.mainContent}>
            <div className={styles.header}>New Playlist</div>
            <div style={{ padding: 10 }}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                <div style={{ marginTop: 8, fontSize: 11, color: '#888', textAlign: 'center' }}>
                    Type a name and press Enter
                </div>
            </div>
        </div>
    );
};

const LoadingScreen = () => (
    <div className={styles.mainContent}>
        <div className={styles.header}>Music</div>
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12
        }}>
            <div style={{
                width: 24,
                height: 24,
                border: '3px solid #ddd',
                borderTopColor: '#4A90D9',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }} />
            <div style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>
                Loading...
            </div>
        </div>
        <style>{`
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `}</style>
    </div>
);

const Screen = ({ menu, menuId, selectedIndex, onUpdateMenu, onGoBack, onCreatePlaylist, isLoading }) => {
    const { title, items } = menu;

    // Extract playlist ID from dynamic menu IDs like "playlist_detail_pl_123"
    const playlistIdMatch = menuId.match(/^playlist_detail_(.+)$/);

    return (
        <div className={styles.screenContainer}>
            <div className={styles.screen}>
                <div className={styles.statusBar}>
                    <div className={styles.statusLeft}>9:41 AM</div>
                    <div className={styles.statusRight}>
                        <span>🔋</span>
                    </div>
                </div>

                {isLoading ? (
                    <LoadingScreen />
                ) : menuId === 'nowplaying' ? (
                    <NowPlaying />
                ) : menuId === 'search' ? (
                    <SearchScreen selectedIndex={selectedIndex} onUpdateMenu={onUpdateMenu} />
                ) : menuId === 'favorites' ? (
                    <FavoritesScreen selectedIndex={selectedIndex} onUpdateMenu={onUpdateMenu} />
                ) : menuId === 'queue' ? (
                    <QueueScreen selectedIndex={selectedIndex} onUpdateMenu={onUpdateMenu} />
                ) : menuId === 'playlists' ? (
                    <PlaylistsScreen selectedIndex={selectedIndex} onUpdateMenu={onUpdateMenu} />
                ) : playlistIdMatch ? (
                    <PlaylistDetailScreen
                        playlistId={playlistIdMatch[1]}
                        selectedIndex={selectedIndex}
                        onUpdateMenu={onUpdateMenu}
                    />
                ) : menuId === 'addToPlaylist' ? (
                    <AddToPlaylistScreen
                        selectedIndex={selectedIndex}
                        onUpdateMenu={onUpdateMenu}
                        onGoBack={onGoBack}
                    />
                ) : menuId === 'createPlaylistInput' ? (
                    <CreatePlaylistInput onDone={onCreatePlaylist} />
                ) : (
                    <div className={styles.mainContent}>
                        <div className={styles.header}>{title}</div>
                        <ul className={styles.menuList}>
                            {items && items.map((item, index) => (
                                <li
                                    key={item.id}
                                    className={index === selectedIndex ? styles.active : ''}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <span>{item.label}</span>
                                        {(item.type === 'menu' || item.type === 'app' || item.type === 'link') && <span>&gt;</span>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Screen;
