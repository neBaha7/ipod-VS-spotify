import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase only if config is present
let auth;
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    // Handle redirect result on page load (for mobile Safari)
    getRedirectResult(auth).catch((error) => {
        console.warn("Redirect result error (may be normal on first load):", error.code);
    });
} else {
    console.warn("Firebase config missing. Using mock auth.");
}

// Detect if we should use redirect instead of popup
// Mobile Safari and some browsers block popups
const isMobileSafari = () => {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    return isIOS || (isSafari && isMobile);
};

export const loginWithGoogle = async () => {
    if (!auth) return mockLogin();

    const provider = new GoogleAuthProvider();

    if (isMobileSafari()) {
        // Use redirect for mobile Safari — avoids storage partitioning issues
        await signInWithRedirect(auth, provider);
        // This won't return — the page redirects to Google
        // After redirect back, getRedirectResult (above) + onAuthStateChanged will handle it
        return null;
    }

    // Desktop: use popup for a smoother experience
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        // If popup is blocked, fall back to redirect
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
            await signInWithRedirect(auth, provider);
            return null;
        }
        console.error("Login failed", error);
        throw error;
    }
};

export const logoutUser = async () => {
    if (!auth) return mockLogout();
    return signOut(auth);
};

export const subscribeToAuth = (callback) => {
    if (!auth) return () => { };
    return onAuthStateChanged(auth, callback);
};

// --- Mocks ---
const mockLogin = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                uid: 'mock-12345',
                displayName: 'Mock User',
                email: 'mock@example.com',
                photoURL: 'https://via.placeholder.com/50'
            });
        }, 800);
    });
};

const mockLogout = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 500);
    });
};
