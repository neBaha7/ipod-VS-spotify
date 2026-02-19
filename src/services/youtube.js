// Detect if running on Vercel (production) or local dev
const IS_PROD = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// ── Piped API instances (used directly in local dev) ─────────────────
const PIPED_INSTANCES = [
    'https://pipedapi.kavin.rocks',
    'https://pipedapi.adminforge.de',
    'https://pipedapi.in.projectsegfau.lt',
];

const FALLBACK = [
    { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', artist: 'Rick Astley', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg' },
    { id: 'kJQP7kiw5Fk', title: 'Despacito', artist: 'Luis Fonsi', thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/default.jpg' },
    { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', thumbnail: 'https://img.youtube.com/vi/JGwWNGJdvx8/default.jpg' },
    { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Bruno Mars', thumbnail: 'https://img.youtube.com/vi/OPf0YbXqDm0/default.jpg' },
    { id: 'RgKAFK5djSk', title: 'See You Again', artist: 'Wiz Khalifa ft. Charlie Puth', thumbnail: 'https://img.youtube.com/vi/RgKAFK5djSk/default.jpg' },
];

// ── Search via Piped directly (local dev only) ───────────────────────
const searchPipedDirect = async (query) => {
    for (const instance of PIPED_INSTANCES) {
        try {
            const res = await fetch(`${instance}/search?q=${encodeURIComponent(query)}&filter=music_songs`, {
                signal: AbortSignal.timeout(5000)
            });
            if (!res.ok) continue;
            const data = await res.json();
            if (!data.items || data.items.length === 0) continue;
            return data.items
                .filter(i => i.type === 'stream')
                .slice(0, 15)
                .map(i => ({
                    id: i.url?.replace('/watch?v=', '') || '',
                    title: i.title || 'Unknown',
                    artist: i.uploaderName || 'Unknown Artist',
                    thumbnail: i.thumbnail || `https://img.youtube.com/vi/${i.url?.replace('/watch?v=', '')}/default.jpg`
                }));
        } catch { continue; }
    }
    return null;
};

// ── Search via Vercel serverless proxy (production) ──────────────────
const searchProxy = async (query) => {
    try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.length > 0 ? data : null;
    } catch { return null; }
};

// ── Main search function ─────────────────────────────────────────────
export const searchYouTube = async (query) => {
    if (!query || query.trim().length === 0) return FALLBACK;

    // In production: use the server proxy to avoid CORS
    if (IS_PROD) {
        const results = await searchProxy(query);
        if (results) return results;
        return FALLBACK;
    }

    // In local dev: try Piped directly, then YouTube API, then fallback
    const pipedResults = await searchPipedDirect(query);
    if (pipedResults) return pipedResults;

    if (API_KEY && API_KEY !== 'YOUR_YOUTUBE_API_KEY') {
        try {
            const res = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`
            );
            const data = await res.json();
            if (!data.error && data.items) {
                return data.items.map(i => ({
                    id: i.id.videoId,
                    title: i.snippet.title,
                    artist: i.snippet.channelTitle,
                    thumbnail: i.snippet.thumbnails.default.url
                }));
            }
        } catch { /* fall through */ }
    }

    return FALLBACK;
};

// ── Autocomplete suggestions ─────────────────────────────────────────
export const getSuggestions = async (query) => {
    if (!query || query.trim().length === 0) return [];

    // In production: use the server proxy
    if (IS_PROD) {
        try {
            const res = await fetch(`/api/suggest?q=${encodeURIComponent(query)}`);
            if (!res.ok) return [];
            return await res.json();
        } catch { return []; }
    }

    // In local dev: call YouTube suggest directly
    try {
        const res = await fetch(
            `https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(query)}`,
            { mode: 'cors' }
        );
        const text = await res.text();
        const jsonStr = text.replace(/^[^[]*(\[.*\])[^]]*$/, '$1');
        const data = JSON.parse(jsonStr);
        if (data && data[1]) return data[1].map(s => s[0]).slice(0, 8);
        return [];
    } catch { return []; }
};
