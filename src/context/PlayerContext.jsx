import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import YouTube from 'react-youtube';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('ipod_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    // Queue State
    const [queue, setQueue] = useState([]);
    const [queueIndex, setQueueIndex] = useState(-1);

    const playerRef = useRef(null);

    // Progress State
    const [progress, setProgress] = useState({ currentTime: 0, duration: 0 });

    // Persist Favorites
    useEffect(() => {
        localStorage.setItem('ipod_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (track) => {
        if (isFavorite(track)) {
            setFavorites(prev => prev.filter(t => t.id !== track.id));
        } else {
            setFavorites(prev => [...prev, track]);
        }
    };

    const isFavorite = (track) => {
        return favorites.some(t => t.id === track.id);
    };

    // Queue Logic
    const addToQueue = useCallback((track) => {
        setQueue(prev => {
            const newQueue = [...prev, track];
            // If nothing is playing, start playing this track
            if (prev.length === 0) {
                setCurrentTrack(track);
                setQueueIndex(0);
                setIsPlaying(true);
            }
            return newQueue;
        });
    }, []);

    const removeFromQueue = useCallback((index) => {
        setQueue(prev => {
            const newQueue = prev.filter((_, i) => i !== index);
            // Adjust queueIndex if needed
            if (index < queueIndex) {
                setQueueIndex(qi => qi - 1);
            } else if (index === queueIndex) {
                // Currently playing track was removed
                if (newQueue.length > 0) {
                    const newIdx = Math.min(index, newQueue.length - 1);
                    setQueueIndex(newIdx);
                    setCurrentTrack(newQueue[newIdx]);
                } else {
                    setQueueIndex(-1);
                    setCurrentTrack(null);
                    setIsPlaying(false);
                }
            }
            return newQueue;
        });
    }, [queueIndex]);

    const clearQueue = useCallback(() => {
        setQueue([]);
        setQueueIndex(-1);
        setCurrentTrack(null);
        setIsPlaying(false);
    }, []);

    const playNext = useCallback(() => {
        if (queue.length === 0) return;
        const nextIndex = queueIndex + 1;
        if (nextIndex < queue.length) {
            setQueueIndex(nextIndex);
            setCurrentTrack(queue[nextIndex]);
            setIsPlaying(true);
            setProgress({ currentTime: 0, duration: 0 });
        }
    }, [queue, queueIndex]);

    const playPrevious = useCallback(() => {
        if (queue.length === 0) return;
        const prevIndex = queueIndex - 1;
        if (prevIndex >= 0) {
            setQueueIndex(prevIndex);
            setCurrentTrack(queue[prevIndex]);
            setIsPlaying(true);
            setProgress({ currentTime: 0, duration: 0 });
        }
    }, [queue, queueIndex]);

    // Playback Logic — plays a single track immediately, replaces entire queue
    const play = useCallback((track) => {
        setQueue([track]);
        setQueueIndex(0);
        setCurrentTrack(track);
        setIsPlaying(true);
        setProgress({ currentTime: 0, duration: 0 });
    }, []);

    // Play a list of tracks starting at a given index
    const playAll = useCallback((tracks, startIndex = 0) => {
        if (!tracks || tracks.length === 0) return;
        setQueue(tracks);
        setQueueIndex(startIndex);
        setCurrentTrack(tracks[startIndex]);
        setIsPlaying(true);
        setProgress({ currentTime: 0, duration: 0 });
    }, []);

    const togglePlay = () => {
        if (!currentTrack) return;
        if (isPlaying) {
            playerRef.current?.pauseVideo?.();
        } else {
            playerRef.current?.playVideo?.();
        }
        setIsPlaying(!isPlaying);
    };

    // Seek to a specific time in seconds
    const seekTo = useCallback((seconds) => {
        if (playerRef.current && playerRef.current.seekTo) {
            playerRef.current.seekTo(seconds, true);
            setProgress(prev => ({ ...prev, currentTime: seconds }));
        }
    }, []);

    const onReady = (event) => {
        playerRef.current = event.target;
        if (isPlaying) event.target.playVideo();
    };

    const onStateChange = useCallback((event) => {
        // 1 = playing, 2 = paused, 0 = ended
        if (event.data === 1) setIsPlaying(true);
        if (event.data === 2) setIsPlaying(false);
        if (event.data === 0) {
            // Song ended — auto-advance to next in queue
            const nextIndex = queueIndex + 1;
            if (nextIndex < queue.length) {
                setQueueIndex(nextIndex);
                setCurrentTrack(queue[nextIndex]);
                setIsPlaying(true);
                setProgress({ currentTime: 0, duration: 0 });
            } else {
                setIsPlaying(false);
            }
        }
    }, [queue, queueIndex]);

    // Polling for Progress
    useEffect(() => {
        let interval;
        if (isPlaying && playerRef.current) {
            interval = setInterval(() => {
                try {
                    const currentTime = playerRef.current.getCurrentTime();
                    const duration = playerRef.current.getDuration();
                    if (currentTime !== undefined && duration !== undefined) {
                        setProgress({ currentTime, duration });
                    }
                } catch (e) {
                    // Player not ready yet
                }
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    // YouTube player opts — hidden, audio only
    const ytOpts = {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 1,
        },
    };

    return (
        <PlayerContext.Provider value={{
            currentTrack,
            isPlaying,
            play,
            playAll,
            togglePlay,
            playerRef,
            onReady,
            onStateChange,
            favorites,
            toggleFavorite,
            isFavorite,
            progress,
            seekTo,
            // Queue
            queue,
            queueIndex,
            addToQueue,
            removeFromQueue,
            clearQueue,
            playNext,
            playPrevious
        }}>
            {children}
            {/* Persistent YouTube Player — always mounted, never unmounts on navigation */}
            {currentTrack && (
                <div style={{ position: 'fixed', top: -9999, left: -9999, width: 0, height: 0, overflow: 'hidden' }}>
                    <YouTube
                        videoId={currentTrack.id}
                        opts={ytOpts}
                        onReady={onReady}
                        onStateChange={onStateChange}
                    />
                </div>
            )}
        </PlayerContext.Provider>
    );
};
