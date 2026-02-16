import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await login();
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            {/* Floating music notes background */}
            <div style={styles.bgNotes}>
                {['♪', '♫', '♬', '♩', '♪', '♫'].map((note, i) => (
                    <span key={i} style={{
                        ...styles.note,
                        left: `${10 + i * 15}%`,
                        animationDelay: `${i * 0.8}s`,
                        fontSize: `${20 + (i % 3) * 10}px`
                    }}>
                        {note}
                    </span>
                ))}
            </div>

            <div style={styles.card}>
                {/* iPod icon */}
                <div style={styles.ipodIcon}>
                    <div style={styles.ipodScreen}>
                        <span style={{ fontSize: 16 }}>🎵</span>
                    </div>
                    <div style={styles.ipodWheel}>
                        <div style={styles.ipodCenter}></div>
                    </div>
                </div>

                <h1 style={styles.title}>iPod Classic</h1>
                <p style={styles.subtitle}>Your music, reimagined</p>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    style={{
                        ...styles.loginBtn,
                        opacity: loading ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(66, 133, 244, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 10px rgba(66, 133, 244, 0.3)';
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: 10, flexShrink: 0 }}>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    {loading ? 'Signing in...' : 'Sign in with Google'}
                </button>

                <p style={styles.footer}>
                    Search & play music from YouTube
                </p>
            </div>

            <style>{`
                @keyframes floatNote {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.15; }
                    50% { transform: translateY(-30px) rotate(10deg); opacity: 0.3; }
                }
            `}</style>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        zIndex: 9999,
        overflow: 'hidden'
    },
    bgNotes: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none'
    },
    note: {
        position: 'absolute',
        top: '20%',
        color: '#fff',
        opacity: 0.15,
        animation: 'floatNote 4s ease-in-out infinite'
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 40px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        maxWidth: 360,
        width: '90%',
        textAlign: 'center'
    },
    ipodIcon: {
        width: 80,
        height: 120,
        background: 'linear-gradient(180deg, #e8e8e8, #c0c0c0)',
        borderRadius: 14,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px 0',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        marginBottom: 24
    },
    ipodScreen: {
        width: 56,
        height: 42,
        background: '#fff',
        borderRadius: 4,
        border: '2px solid #999',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8
    },
    ipodWheel: {
        width: 50,
        height: 50,
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.15)'
    },
    ipodCenter: {
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #e8e8e8, #ccc)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
    },
    title: {
        fontSize: 28,
        fontWeight: 700,
        color: '#fff',
        margin: '0 0 6px 0',
        letterSpacing: '-0.5px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        margin: '0 0 32px 0'
    },
    loginBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 28px',
        fontSize: 15,
        fontWeight: 600,
        color: '#fff',
        background: '#4285F4',
        border: 'none',
        borderRadius: 12,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 10px rgba(66, 133, 244, 0.3)',
        width: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    footer: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.3)',
        marginTop: 20,
        marginBottom: 0
    }
};

export default LoginScreen;
