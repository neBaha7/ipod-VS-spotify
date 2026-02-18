import React, { useRef, useCallback } from 'react';
import styles from './Screen.module.css';
import { usePlayer } from '../../context/PlayerContext';

const NowPlaying = () => {
    const {
        currentTrack, isPlaying, progress, seekTo,
        toggleFavorite, isFavorite,
        queue, queueIndex, playNext, playPrevious
    } = usePlayer();

    const timelineRef = useRef(null);
    const isDragging = useRef(false);

    if (!currentTrack) {
        return <div className={styles.mainContent} style={{ justifyContent: 'center', alignItems: 'center' }}>No Music Playing</div>;
    }

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const isFav = isFavorite(currentTrack);
    const hasNext = queueIndex < queue.length - 1;
    const hasPrev = queueIndex > 0;
    const progressPercent = progress.duration > 0 ? (progress.currentTime / progress.duration) * 100 : 0;

    // Calculate seek position from mouse/touch event on timeline
    const getSeekPosition = (e) => {
        const rect = timelineRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const fraction = x / rect.width;
        return fraction * progress.duration;
    };

    const handleTimelineClick = (e) => {
        if (!progress.duration) return;
        const seconds = getSeekPosition(e);
        seekTo(seconds);
    };

    const handleScrubStart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        isDragging.current = true;

        const handleScrubMove = (moveEvent) => {
            if (!isDragging.current) return;
            moveEvent.preventDefault();
            const seconds = getSeekPosition(moveEvent);
            seekTo(seconds);
        };

        const handleScrubEnd = () => {
            isDragging.current = false;
            window.removeEventListener('mousemove', handleScrubMove);
            window.removeEventListener('mouseup', handleScrubEnd);
            window.removeEventListener('touchmove', handleScrubMove);
            window.removeEventListener('touchend', handleScrubEnd);
        };

        window.addEventListener('mousemove', handleScrubMove);
        window.addEventListener('mouseup', handleScrubEnd);
        window.addEventListener('touchmove', handleScrubMove, { passive: false });
        window.addEventListener('touchend', handleScrubEnd);
    };

    return (
        <div className={styles.mainContent}>
            <div className={styles.header}>Now Playing</div>
            <div style={{ padding: '8px 16px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Album art */}
                <img
                    src={currentTrack.thumbnail}
                    alt="Album Art"
                    style={{
                        width: 100, height: 100, marginBottom: 10,
                        borderRadius: 4,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                    }}
                />

                {/* Track info */}
                <div style={{ marginBottom: 8, width: '100%' }}>
                    <div style={{
                        fontSize: 12, fontWeight: 'bold',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                        {currentTrack.title}
                    </div>
                    <div style={{ fontSize: 10, color: '#666' }}>{currentTrack.artist}</div>
                </div>

                {/* Clickable/Draggable Timeline */}
                <div style={{ width: '100%', marginBottom: 6 }}>
                    <div
                        ref={timelineRef}
                        onClick={handleTimelineClick}
                        style={{
                            width: '100%', height: 16,
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center',
                            position: 'relative',
                            touchAction: 'none',
                        }}
                    >
                        {/* Track groove */}
                        <div style={{
                            width: '100%', height: 4,
                            background: '#ddd', borderRadius: 2,
                            overflow: 'visible', position: 'relative'
                        }}>
                            {/* Filled portion */}
                            <div style={{
                                width: `${progressPercent}%`,
                                height: '100%',
                                background: 'linear-gradient(to right, #4A90D9, #3478C6)',
                                borderRadius: 2,
                                transition: isDragging.current ? 'none' : 'width 0.3s linear'
                            }} />
                            {/* Scrubber handle */}
                            <div
                                onMouseDown={handleScrubStart}
                                onTouchStart={handleScrubStart}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: `${progressPercent}%`,
                                    transform: 'translate(-50%, -50%)',
                                    width: 12, height: 12,
                                    borderRadius: '50%',
                                    background: '#fff',
                                    border: '2px solid #3478C6',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                                    cursor: 'grab',
                                    zIndex: 2,
                                    touchAction: 'none',
                                }}
                            />
                        </div>
                    </div>
                    {/* Time labels */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: 9, color: '#888', marginTop: 1
                    }}>
                        <span>{formatTime(progress.currentTime)}</span>
                        <span>-{formatTime(Math.max(0, progress.duration - progress.currentTime))}</span>
                    </div>
                </div>

                {/* Playback indicator */}
                <div style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>
                    {isPlaying ? '▶ Playing' : '❚❚ Paused'}
                </div>

                {/* Skip Controls + Star */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div
                        onClick={hasPrev ? playPrevious : undefined}
                        style={{ cursor: hasPrev ? 'pointer' : 'default', fontSize: 16, opacity: hasPrev ? 1 : 0.3 }}
                    >
                        ⏮
                    </div>
                    <div
                        onClick={() => toggleFavorite(currentTrack)}
                        style={{ cursor: 'pointer', fontSize: 22, color: isFav ? '#f39c12' : '#ccc' }}
                    >
                        {isFav ? '★' : '☆'}
                    </div>
                    <div
                        onClick={hasNext ? playNext : undefined}
                        style={{ cursor: hasNext ? 'pointer' : 'default', fontSize: 16, opacity: hasNext ? 1 : 0.3 }}
                    >
                        ⏭
                    </div>
                </div>

                {/* Queue Position */}
                {queue.length > 1 && (
                    <div style={{ fontSize: 9, color: '#999', marginTop: 4 }}>
                        {queueIndex + 1} of {queue.length}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NowPlaying;
