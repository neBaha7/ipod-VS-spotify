import React, { useEffect } from 'react';
import styles from './Screen.module.css';
import { usePlayer } from '../../context/PlayerContext';

const QueueScreen = ({ selectedIndex, onUpdateMenu }) => {
    const { queue, queueIndex } = usePlayer();

    useEffect(() => {
        const items = queue.map((track, i) => ({
            ...track,
            type: 'track',
            label: track.title,
            id: track.id + '_q' + i // Unique key per position
        }));
        onUpdateMenu('queue', items);
    }, [queue, onUpdateMenu]);

    return (
        <div className={styles.mainContent}>
            <div className={styles.header}>Queue</div>
            {queue.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: '#666', fontSize: 13 }}>
                    Queue is empty.<br />Search for songs and add them!
                </div>
            ) : (
                <ul className={styles.menuList}>
                    {queue.map((item, index) => (
                        <li
                            key={item.id + '_q' + index}
                            className={index === selectedIndex ? styles.active : ''}
                            style={{
                                background: index === queueIndex ? 'rgba(52, 152, 219, 0.15)' : undefined,
                                borderLeft: index === queueIndex ? '3px solid #3498db' : '3px solid transparent'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 10, color: '#999', minWidth: 16, textAlign: 'right' }}>
                                    {index === queueIndex ? '▶' : index + 1}
                                </span>
                                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                    <span style={{
                                        fontWeight: index === queueIndex ? '700' : '600',
                                        fontSize: '12px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {item.title}
                                    </span>
                                    <span style={{ fontSize: 10, opacity: 0.8 }}>{item.artist}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default QueueScreen;
