import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginWithGoogle, logoutUser, subscribeToAuth } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [ipodColor, setIpodColor] = useState('silver');

    useEffect(() => {
        const unsubscribe = subscribeToAuth((currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        // If subscribeToAuth returns a no-op (mock mode), stop loading
        const timer = setTimeout(() => setAuthLoading(false), 1500);
        return () => {
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

