import React, { useMemo, useRef, useCallback } from 'react';
import styles from './Shell.module.css';
import ClickWheel from './ClickWheel';
import Screen from './Screen';
import { useAuth } from '../../context/AuthContext';
import { usePlayer } from '../../context/PlayerContext';
import { usePlaylist } from '../../context/PlaylistContext';
import { ipodColors } from '../../utils/theme';
import { useMenu } from '../../hooks/useMenu';
import { useClickWheel } from '../../hooks/useClickWheel';

const Shell = () => {
    const { ipodColor } = useAuth();
    const { togglePlay, playNext, playPrevious, seekTo, progress } = usePlayer();
    const { createPlaylist, addToPlaylist, pendingTrack, setPendingTrack } = usePlaylist();
    const theme = useMemo(() => ipodColors[ipodColor] || ipodColors.silver, [ipodColor]);

    const { currentMenu, selectedIndex, scroll, select, back, updateMenuItems, currentMenuId, isLoading } = useMenu();
    const wheelRef = useRef(null);

    // On NowPlaying: scroll seeks ±10s, elsewhere scroll navigates
    const handleScroll = useCallback((direction) => {
        if (currentMenuId === 'nowplaying') {
            const seekAmount = 10; // seconds
            const newTime = Math.max(0, Math.min(
                progress.currentTime + (direction * seekAmount),
                progress.duration || 0
            ));
            seekTo(newTime);
        } else {
            scroll(direction);
        }
    }, [currentMenuId, progress, seekTo, scroll]);

    useClickWheel(wheelRef, handleScroll);

    const handleForward = () => {
        if (currentMenuId === 'nowplaying') {
            playNext();
        } else {
            scroll(1);
        }
    };

    const handleBackward = () => {
        if (currentMenuId === 'nowplaying') {
            playPrevious();
        } else {
            back();
        }
    };

    const handleCreatePlaylist = useCallback((name) => {
        const pl = createPlaylist(name);
        // If there's a pending track, add it to the new playlist
        if (pendingTrack) {
            addToPlaylist(pl.id, pendingTrack);
            setPendingTrack(null);
        }
        // Go back after creation
        back();
    }, [createPlaylist, addToPlaylist, pendingTrack, setPendingTrack, back]);

    return (
        <div
            className={styles.shell}
            style={{
                background: theme.body,
                '--bezel-color': theme.bezel
            }}
        >
            <Screen
                menu={currentMenu}
                menuId={currentMenuId}
                selectedIndex={selectedIndex}
                onUpdateMenu={updateMenuItems}
                onGoBack={back}
                onCreatePlaylist={handleCreatePlaylist}
                isLoading={isLoading}
            />
            <ClickWheel
                ref={wheelRef}
                wheelColor={theme.wheel}
                onMenu={back}
                onCenter={select}
                onPlay={togglePlay}
                onForward={handleForward}
                onBackward={handleBackward}
            />
        </div>
    );
};

export default Shell;
