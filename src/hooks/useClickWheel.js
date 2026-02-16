import { useRef, useEffect, useCallback } from 'react';

export const useClickWheel = (containerRef, onScroll, onSelect, onMenu, onBack) => {
    const stateRef = useRef({
        isDragging: false,
        startAngle: 0,
        prevAngle: 0,
        accumulatedDelta: 0,
    });

    const getAngle = (e) => {
        if (!containerRef.current) return 0;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    };

    const handleStart = useCallback((e) => {
        if (e.touches) e.preventDefault(); // Prevent page scroll on mobile
        stateRef.current.isDragging = true;
        stateRef.current.startAngle = getAngle(e);
        stateRef.current.prevAngle = stateRef.current.startAngle;
        stateRef.current.accumulatedDelta = 0;
    }, []);

    const handleMove = useCallback((e) => {
        if (!stateRef.current.isDragging) return;
        if (e.touches) e.preventDefault(); // Prevent page scroll on mobile
        const currentAngle = getAngle(e);
        let delta = currentAngle - stateRef.current.prevAngle;

        // Handle wrap-around (e.g., from 179 to -179)
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        stateRef.current.accumulatedDelta += delta;
        stateRef.current.prevAngle = currentAngle;

        // Trigger scroll every 15 degrees
        if (stateRef.current.accumulatedDelta > 15) {
            onScroll(1); // Scroll Down/Next
            stateRef.current.accumulatedDelta -= 15;
        } else if (stateRef.current.accumulatedDelta < -15) {
            onScroll(-1); // Scroll Up/Prev
            stateRef.current.accumulatedDelta += 15;
        }
    }, [onScroll]);

    const handleEnd = useCallback(() => {
        stateRef.current.isDragging = false;
    }, []);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const onTouchStart = (e) => handleStart(e);
        const onMouseDown = (e) => handleStart(e);

        element.addEventListener('mousedown', onMouseDown);
        element.addEventListener('touchstart', onTouchStart, { passive: false });
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchend', handleEnd);

        return () => {
            element.removeEventListener('mousedown', onMouseDown);
            element.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [handleStart, handleMove, handleEnd]); // Dependencies
};
