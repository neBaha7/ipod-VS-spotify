import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const PlaylistContext = createContext();

export const usePlaylist = () => useContext(PlaylistContext);

export const PlaylistProvider = ({ children }) => {
    const [playlists, setPlaylists] = useState(() => {
        const saved = localStorage.getItem('ipod_playlists');
        return saved ? JSON.parse(saved) : [];
    });

    // Track pending to be added to a playlist (set before navigating to AddToPlaylist screen)
    const [pendingTrack, setPendingTrack] = useState(null);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('ipod_playlists', JSON.stringify(playlists));
    }, [playlists]);

    const createPlaylist = useCallback((name) => {
        const newPlaylist = {
            id: 'pl_' + Date.now(),
            name,
            tracks: []
        };
        setPlaylists(prev => [...prev, newPlaylist]);
        return newPlaylist;
    }, []);

    const addToPlaylist = useCallback((playlistId, track) => {
        setPlaylists(prev => prev.map(pl => {
            if (pl.id !== playlistId) return pl;
            // Deduplicate by track id
            if (pl.tracks.some(t => t.id === track.id)) return pl;
            return { ...pl, tracks: [...pl.tracks, track] };
        }));
    }, []);

    const removeFromPlaylist = useCallback((playlistId, trackId) => {
        setPlaylists(prev => prev.map(pl => {
            if (pl.id !== playlistId) return pl;
            return { ...pl, tracks: pl.tracks.filter(t => t.id !== trackId) };
        }));
    }, []);

    const deletePlaylist = useCallback((playlistId) => {
        setPlaylists(prev => prev.filter(pl => pl.id !== playlistId));
    }, []);

    const getPlaylist = useCallback((playlistId) => {
        return playlists.find(pl => pl.id === playlistId) || null;
    }, [playlists]);

    return (
        <PlaylistContext.Provider value={{
            playlists,
            pendingTrack,
            setPendingTrack,
            createPlaylist,
            addToPlaylist,
            removeFromPlaylist,
            deletePlaylist,
            getPlaylist
        }}>
            {children}
        </PlaylistContext.Provider>
    );
};
