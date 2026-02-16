import React from 'react';
import YouTube from 'react-youtube';
import styles from './Screen.module.css';
import { usePlayer } from '../../context/PlayerContext';

const NowPlaying = () => {
    const { currentTrack, onReady, onStateChange, progress, toggleFavorite, isFavorite, queue, queueIndex, playNext, playPrevious } = usePlayer();

    if (!currentTrack) {
        return <div className={styles.mainContent} style={{ justifyContent: 'center', alignItems: 'center' }}>No Music Playing</div>;
    }

    const formatTime = (seconds) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const isFav = isFavorite(currentTrack);
    const hasNext = queueIndex < queue.length - 1;
    const hasPrev = queueIndex > 0;

    const opts = {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 1,
        },
    };

    return (
        <div className={styles.mainContent}>
            <div className={styles.header}>Now Playing</div>
            <div style={{ padding: '10px 20px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <img src={currentTrack.thumbnail} alt="Album Art" style={{ width: 120, height: 120, marginBottom: 15, boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }} />

                <div style={{ marginBottom: 10, width: '100%' }}>
                    <div style={{ fontSize: 13, fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentTrack.title}</div>
                    <div style={{ fontSize: 11, color: '#666' }}>{currentTrack.artist}</div>
                </div>

                {/* Timeline */}
                <div style={{ width: '100%', marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#666', marginBottom: 2 }}>
                        <span>{formatTime(progress.currentTime)}</span>
                        <span>{formatTime(progress.duration)}</span>
                    </div>
                    <div style={{ width: '100%', height: 6, background: '#ccc', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                            width: `${(progress.currentTime / (progress.duration || 1)) * 100}%`,
                            height: '100%',
                            background: '#3498db'
                        }} />
                    </div>
                </div>

                {/* Skip Controls + Star */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 5 }}>
                    <div
                        onClick={hasPrev ? playPrevious : undefined}
                        style={{ cursor: hasPrev ? 'pointer' : 'default', fontSize: 18, opacity: hasPrev ? 1 : 0.3 }}
                    >
                        ⏮
                    </div>
                    <div
                        onClick={() => toggleFavorite(currentTrack)}
                        style={{ cursor: 'pointer', fontSize: 24, color: isFav ? '#f39c12' : '#ccc' }}
                    >
                        {isFav ? '★' : '☆'}
                    </div>
                    <div
                        onClick={hasNext ? playNext : undefined}
                        style={{ cursor: hasNext ? 'pointer' : 'default', fontSize: 18, opacity: hasNext ? 1 : 0.3 }}
                    >
                        ⏭
                    </div>
                </div>

                {/* Queue Position */}
                {queue.length > 1 && (
                    <div style={{ fontSize: 10, color: '#999', marginTop: 8 }}>
                        {queueIndex + 1} of {queue.length}
                    </div>
                )}

                {/* Hidden Player */}
                <div style={{ display: 'none' }}>
                    <YouTube videoId={currentTrack.id} opts={opts} onReady={onReady} onStateChange={onStateChange} />
                </div>
            </div>
        </div>
    );
};

export default NowPlaying;

