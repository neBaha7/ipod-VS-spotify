const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// ── Free YouTube search via Piped API (no API key needed) ──────────────
const PIPED_INSTANCES = [
    'https://pipedapi.kavin.rocks',
    'https://pipedapi.adminforge.de',
    'https://pipedapi.in.projectsegfau.lt',
];

const searchPiped = async (query) => {
    for (const instance of PIPED_INSTANCES) {
        try {
            const res = await fetch(`${instance}/search?q=${encodeURIComponent(query)}&filter=music_songs`, {
                signal: AbortSignal.timeout(5000)
            });
            if (!res.ok) continue;
            const data = await res.json();
            if (!data.items || data.items.length === 0) continue;

            return data.items
                .filter(item => item.type === 'stream')
                .slice(0, 15)
                .map(item => ({
                    id: item.url?.replace('/watch?v=', '') || '',
                    title: item.title || 'Unknown',
                    artist: item.uploaderName || 'Unknown Artist',
                    thumbnail: item.thumbnail || `https://img.youtube.com/vi/${item.url?.replace('/watch?v=', '')}/default.jpg`
                }));
        } catch (e) {
            console.warn(`Piped instance ${instance} failed:`, e.message);
            continue;
        }
    }
    return null; // All instances failed
};

// ── YouTube Data API v3 search (requires API key) ────────────────────
const searchYouTubeAPI = async (query) => {
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=${API_KEY}`
    );
    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message);
    }

    return data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.default.url
    }));
};

// ── Small fallback library (only used if ALL APIs fail) ──────────────
const FALLBACK = [
    { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', artist: 'Rick Astley', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg' },
    { id: 'kJQP7kiw5Fk', title: 'Despacito', artist: 'Luis Fonsi', thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/default.jpg' },
    { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', thumbnail: 'https://img.youtube.com/vi/JGwWNGJdvx8/default.jpg' },
    { id: 'RgKAFK5djSk', title: 'See You Again', artist: 'Wiz Khalifa ft. Charlie Puth', thumbnail: 'https://img.youtube.com/vi/RgKAFK5djSk/default.jpg' },
    { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Bruno Mars', thumbnail: 'https://img.youtube.com/vi/OPf0YbXqDm0/default.jpg' },
];

// ── Main search function: tries Piped → YouTube API → fallback ───────
export const searchYouTube = async (query) => {
    if (!query || query.trim().length === 0) return FALLBACK;

    // 1. Try Piped API first (free, no key needed)
    try {
        const pipedResults = await searchPiped(query);
        if (pipedResults && pipedResults.length > 0) return pipedResults;
    } catch (e) {
        console.warn('Piped search failed:', e.message);
    }

    // 2. Try YouTube Data API if key is available
    if (API_KEY && API_KEY !== 'YOUR_YOUTUBE_API_KEY') {
        try {
            const apiResults = await searchYouTubeAPI(query);
            if (apiResults.length > 0) return apiResults;
        } catch (e) {
            console.warn('YouTube API search failed:', e.message);
        }
    }

    // 3. Last resort: return fallback
    console.warn('All search providers failed, using fallback');
    return FALLBACK;
};

// ── Autocomplete suggestions via YouTube suggest API ─────────────────
export const getSuggestions = async (query) => {
    if (!query || query.trim().length === 0) return [];

    try {
        const res = await fetch(
            `https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(query)}`,
            { mode: 'cors' }
        );
        const text = await res.text();
        const jsonStr = text.replace(/^[^[]*(\[.*\])[^]]*$/, '$1');
        const data = JSON.parse(jsonStr);
        if (data && data[1]) {
            return data[1].map(s => s[0]).slice(0, 8);
        }
        return [];
    } catch {
        return [];
    }
};
