import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

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
} else {
    console.warn("Firebase config missing. Using mock auth.");
}

export const loginWithGoogle = async () => {
    if (!auth) return mockLogin();

    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
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
