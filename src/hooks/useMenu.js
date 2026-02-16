import { useState, useCallback, useRef } from 'react';
import { menus as initialMenus } from '../utils/menus';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylist } from '../context/PlaylistContext';

export const useMenu = () => {
    const [menus, setMenus] = useState(initialMenus);
    const [path, setPath] = useState(['main']); // Stack of menu IDs
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { changeColor, login, logout, user } = useAuth();
    const { play, addToQueue } = usePlayer();
    const { pendingTrack, setPendingTrack, addToPlaylist, createPlaylist } = usePlaylist();

    // Store the track that was selected to show trackActions menu
    const pendingActionTrackRef = useRef(null);

    // Helper to get current menu object
    const currentMenuId = path[path.length - 1];
    const currentMenu = menus[currentMenuId] || menus.main;

    const updateMenuItems = useCallback((menuId, items) => {
        setMenus(prev => ({
            ...prev,
            [menuId]: { ...prev[menuId], items }
        }));
    }, []);

    const scroll = useCallback((direction) => {
        setSelectedIndex(prev => {
            const count = currentMenu.items ? currentMenu.items.length : 0;
            if (count === 0) return 0;
            const next = prev + direction;
            if (next < 0) return 0;
            if (next >= count) return count - 1;
            return next;
        });
    }, [currentMenu]);

    const select = useCallback(() => {
        if (!currentMenu.items || currentMenu.items.length === 0) return;

        const item = currentMenu.items[selectedIndex];

        if (item.type === 'menu' || item.type === 'app') {
            // If selecting a playlist from the playlists list, navigate to its detail
            if (item.id && item.id.startsWith('pl_')) {
                const detailMenuId = 'playlist_detail_' + item.id;
                // Register the dynamic menu if it doesn't exist
                setMenus(prev => ({
                    ...prev,
                    [detailMenuId]: prev[detailMenuId] || { title: item.label, items: [] }
                }));
                setPath([...path, detailMenuId]);
                setSelectedIndex(0);
                return;
            }
            setPath([...path, item.id]);
            setSelectedIndex(0);
        } else if (item.type === 'back') {
            goBack();
        } else if (item.type === 'link') {
            if (item.id === 'nowplaying') {
                setPath([...path, 'nowplaying']);
            }
        } else if (item.type === 'action') {
            handleAction(item);
        } else if (item.type === 'track') {
            // Play track immediately on tap
            addToQueue(item);
            setPath([...path, 'nowplaying']);
            setSelectedIndex(0);
        }
    }, [currentMenu, selectedIndex, path, play, addToQueue]);

    const goBack = useCallback(() => {
        if (path.length > 1) {
            setPath(prev => prev.slice(0, -1));
            setSelectedIndex(0);
        }
    }, [path]);

    const handleAction = (item) => {
        if (item.action === 'setColor') {
            changeColor(item.id);
            goBack();
        } else if (item.id === 'auth') {
            if (user) logout();
            else login();
            goBack();
        } else if (item.action === 'playNow') {
            // Play the pending track
            const track = pendingActionTrackRef.current;
            if (track) {
                addToQueue(track);
                pendingActionTrackRef.current = null;
                // Replace trackActions in path with nowplaying
                setPath(prev => [...prev.slice(0, -1), 'nowplaying']);
                setSelectedIndex(0);
            }
        } else if (item.action === 'addToPlaylist') {
            // Navigate to addToPlaylist screen
            const track = pendingActionTrackRef.current;
            if (track) {
                setPendingTrack(track);
                pendingActionTrackRef.current = null;
                setPath(prev => [...prev.slice(0, -1), 'addToPlaylist']);
                setSelectedIndex(0);
            }
        } else if (item.action === 'createPlaylist') {
            // Navigate to addToPlaylist screen in "create mode" (no pending track)
            setPath([...path, 'createPlaylistInput']);
            setSelectedIndex(0);
        } else if (item.action === 'newPlaylistInline') {
            // Show inline create input inside AddToPlaylistScreen
            setPath([...path, 'createPlaylistInput']);
            setSelectedIndex(0);
        } else if (item.action === 'pickPlaylist') {
            // Add pending track to the selected playlist and go back
            if (pendingTrack) {
                addToPlaylist(item.id, pendingTrack);
                setPendingTrack(null);
            }
            goBack();
            goBack();
        }
    };

    return {
        currentMenu,
        selectedIndex,
        scroll,
        select,
        back: goBack,
        path,
        updateMenuItems,
        currentMenuId
    };
};
