import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginWithGoogle, logoutUser, subscribeToAuth, checkRedirectResult } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [ipodColor, setIpodColor] = useState('silver');

    useEffect(() => {
        let cancelled = false;

        // 1. Listen for auth state changes (fires for both popup and redirect)
        const unsubscribe = subscribeToAuth((currentUser) => {
            if (!cancelled) {
                setUser(currentUser);
                setAuthLoading(false);
            }
        });

        // 2. Check for redirect result (mobile Safari flow)
        // This resolves AFTER onAuthStateChanged — so if redirect happened,
        // onAuthStateChanged will already fire with the user
        checkRedirectResult().then((redirectUser) => {
            if (!cancelled && redirectUser) {
                setUser(redirectUser);
            }
            // Mark loading done after redirect check completes
            if (!cancelled) {
                setAuthLoading(false);
            }
        });

        // 3. Safety timeout for mock auth (where subscribeToAuth is a no-op)
        const timer = setTimeout(() => {
            if (!cancelled) setAuthLoading(false);
        }, 3000);

        return () => {
            cancelled = true;
            unsubscribe();
            clearTimeout(timer);
        };
    }, []);

    const login = async () => {
        try {
            const result = await loginWithGoogle();
            // For mock auth, manually set the user since onAuthStateChanged won't fire
            if (result && !user) {
                setUser(result);
            }
        } catch (error) {
            console.error("Login failed context", error);
        }
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
        setIpodColor('silver');
    };

    const changeColor = (color) => {
        setIpodColor(color);
    };

    return (
        <AuthContext.Provider value={{ user, authLoading, login, logout, ipodColor, changeColor }}>
            {children}
        </AuthContext.Provider>
    );
};
