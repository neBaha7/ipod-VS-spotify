import React, { forwardRef } from 'react';
import styles from './ClickWheel.module.css';
import { FaPlay, FaPause, FaForward, FaBackward, FaBars } from 'react-icons/fa';

const ClickWheel = forwardRef(({ wheelColor, onMenu, onCenter, onPlay, onForward, onBackward }, ref) => {
    return (
        <div className={styles.wheelContainer}>
            <div className={styles.wheel} ref={ref} style={{ background: wheelColor || '#fdfdfd' }}>
                <div className={styles.menuBtn} onClick={onMenu}>MENU</div>
                <div className={styles.forwardBtn} onClick={onForward}><FaForward /></div>
                <div className={styles.backwardBtn} onClick={onBackward}><FaBackward /></div>
                <div className={styles.playPauseBtn} onClick={onPlay}>
                    <FaPlay size={10} style={{ marginRight: 2 }} /> <FaPause size={10} />
                </div>
                <div className={styles.centerButton} onClick={onCenter}></div>
            </div>
        </div>
    );
});

export default ClickWheel;
