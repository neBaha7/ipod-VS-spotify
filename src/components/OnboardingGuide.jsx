import React, { useState } from 'react';

const steps = [
    {
        icon: '🔄',
        title: 'Scroll',
        description: 'Rotate the click wheel to scroll through menus and lists'
    },
    {
        icon: '⏺',
        title: 'Select',
        description: 'Press the center button to select a menu item or track'
    },
    {
        icon: '⬅️',
        title: 'Go Back',
        description: 'Press MENU or the ◀◀ button to go back one step'
    },
    {
        icon: '⏯',
        title: 'Play / Pause',
        description: 'Press ▶❚❚ at the bottom of the wheel to play or pause music'
    },
    {
        icon: '🔍',
        title: 'Search Songs',
        description: 'Go to Music → Search to find songs on YouTube'
    },
    {
        icon: '🎵',
        title: 'Track Options',
        description: 'Select a track to see options: Play Now or Add to Playlist'
    }
];

const OnboardingGuide = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const next = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(s => s + 1);
        } else {
            finish();
        }
    };

    const prev = () => {
        if (currentStep > 0) {
            setCurrentStep(s => s - 1);
        }
    };

    const finish = () => {
        localStorage.setItem('ipod_onboarding_done', 'true');
        onComplete();
    };

    const step = steps[currentStep];
    const isLast = currentStep === steps.length - 1;

    return (
        <div style={styles.overlay}>
            <div style={styles.card}>
                {/* Skip button */}
                <button onClick={finish} style={styles.skipBtn}>
                    Skip
                </button>

                {/* Step content */}
                <div style={styles.iconCircle}>
                    <span style={{ fontSize: 40 }}>{step.icon}</span>
                </div>
                <h2 style={styles.title}>{step.title}</h2>
                <p style={styles.desc}>{step.description}</p>

                {/* Dots */}
                <div style={styles.dots}>
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            style={{
                                ...styles.dot,
                                background: i === currentStep ? '#4285F4' : 'rgba(255,255,255,0.2)'
                            }}
                        />
                    ))}
                </div>

                {/* Navigation */}
                <div style={styles.navRow}>
                    <button
                        onClick={prev}
                        disabled={currentStep === 0}
                        style={{
                            ...styles.navBtn,
                            opacity: currentStep === 0 ? 0.3 : 1
                        }}
                    >
                        ← Back
                    </button>
                    <button onClick={next} style={styles.nextBtn}>
                        {isLast ? 'Get Started' : 'Next →'}
                    </button>
                </div>

                {/* Step counter */}
                <p style={styles.counter}>
                    {currentStep + 1} / {steps.length}
                </p>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 10000
    },
    card: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 36px 32px',
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(20px)',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        maxWidth: 380,
        width: '90%',
        textAlign: 'center'
    },
    skipBtn: {
        position: 'absolute',
        top: 16,
        right: 20,
        background: 'none',
        border: 'none',
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        cursor: 'pointer',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        padding: '4px 8px',
        borderRadius: 6,
        transition: 'color 0.2s'
    },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: '50%',
        background: 'rgba(66, 133, 244, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        border: '2px solid rgba(66, 133, 244, 0.2)'
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        color: '#fff',
        margin: '0 0 8px 0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    desc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        margin: '0 0 24px 0',
        lineHeight: 1.5,
        maxWidth: 280
    },
    dots: {
        display: 'flex',
        gap: 8,
        marginBottom: 24
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        transition: 'background 0.3s'
    },
    navRow: {
        display: 'flex',
        gap: 12,
        width: '100%'
    },
    navBtn: {
        flex: 1,
        padding: '10px 16px',
        fontSize: 14,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.7)',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        cursor: 'pointer',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        transition: 'all 0.2s'
    },
    nextBtn: {
        flex: 1,
        padding: '10px 16px',
        fontSize: 14,
        fontWeight: 600,
        color: '#fff',
        background: '#4285F4',
        border: 'none',
        borderRadius: 10,
        cursor: 'pointer',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        transition: 'all 0.2s',
        boxShadow: '0 2px 8px rgba(66, 133, 244, 0.3)'
    },
    counter: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.3)',
        marginTop: 16,
        marginBottom: 0
    }
};

export default OnboardingGuide;
