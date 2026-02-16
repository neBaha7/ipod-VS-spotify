import React, { forwardRef } from 'react';
import styles from './ClickWheel.module.css';
import { FaPlay, FaPause, FaForward, FaBackward, FaBars } from 'react-icons/fa';

const ClickWheel = forwardRef(({ wheelColor, onMenu, onCenter, onPlay, onForward, onBackward }, ref) => {
    // Use both onClick (desktop) and onTouchEnd (mobile) since preventDefault on touchstart blocks click
    const tap = (handler) => ({
        onClick: handler,
        onTouchEnd: (e) => { e.stopPropagation(); handler(e); },
    });

    return (
        <div className={styles.wheelContainer}>
            <div className={styles.wheel} ref={ref} style={{ background: wheelColor || '#fdfdfd' }}>
                <div className={styles.menuBtn} data-button="true" {...tap(onMenu)}>MENU</div>
                <div className={styles.forwardBtn} data-button="true" {...tap(onForward)}><FaForward /></div>
                <div className={styles.backwardBtn} data-button="true" {...tap(onBackward)}><FaBackward /></div>
                <div className={styles.playPauseBtn} data-button="true" {...tap(onPlay)}>
                    <FaPlay size={10} style={{ marginRight: 2 }} /> <FaPause size={10} />
                </div>
                <div className={styles.centerButton} data-button="true" {...tap(onCenter)}></div>
            </div>
        </div>
    );
});

export default ClickWheel;
