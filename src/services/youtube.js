const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const MOCK_LIBRARY = [
    { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', artist: 'Rick Astley', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg' },
    { id: 'kJQP7kiw5Fk', title: 'Despacito', artist: 'Luis Fonsi', thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/default.jpg' },
    { id: 'L_jWHffIx5E', title: 'All Star', artist: 'Smash Mouth', thumbnail: 'https://img.youtube.com/vi/L_jWHffIx5E/default.jpg' },
    { id: 'fJ9rUzIMcZQ', title: 'Bohemian Rhapsody', artist: 'Queen', thumbnail: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/default.jpg' },
    { id: 'hTWCb5ctq0s', title: 'One More Time', artist: 'Daft Punk', thumbnail: 'https://img.youtube.com/vi/hTWCb5ctq0s/default.jpg' },
    { id: '9bZkp7q19f0', title: 'Gangnam Style', artist: 'PSY', thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/default.jpg' },
    { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', thumbnail: 'https://img.youtube.com/vi/JGwWNGJdvx8/default.jpg' },
    { id: 'RgKAFK5djSk', title: 'See You Again', artist: 'Wiz Khalifa ft. Charlie Puth', thumbnail: 'https://img.youtube.com/vi/RgKAFK5djSk/default.jpg' },
    { id: 'CevxZvSJLk8', title: 'Roar', artist: 'Katy Perry', thumbnail: 'https://img.youtube.com/vi/CevxZvSJLk8/default.jpg' },
    { id: 'YQHsXMglC9A', title: 'Hello', artist: 'Adele', thumbnail: 'https://img.youtube.com/vi/YQHsXMglC9A/default.jpg' },
    { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', thumbnail: 'https://img.youtube.com/vi/OPf0YbXqDm0/default.jpg' },
    { id: 'bo_efYhYU2A', title: 'Sugar', artist: 'Maroon 5', thumbnail: 'https://img.youtube.com/vi/bo_efYhYU2A/default.jpg' },
    { id: 'pRpeEdMmmQ0', title: 'Shake It Off', artist: 'Taylor Swift', thumbnail: 'https://img.youtube.com/vi/pRpeEdMmmQ0/default.jpg' },
    { id: 'IcrbM1l_BoI', title: 'Counting Stars', artist: 'OneRepublic', thumbnail: 'https://img.youtube.com/vi/IcrbM1l_BoI/default.jpg' },
    { id: 'lp-EO5I60KA', title: 'Somebody That I Used To Know', artist: 'Gotye', thumbnail: 'https://img.youtube.com/vi/lp-EO5I60KA/default.jpg' },
    { id: 'QK8mJJJvaes', title: 'Blank Space', artist: 'Taylor Swift', thumbnail: 'https://img.youtube.com/vi/QK8mJJJvaes/default.jpg' },
    { id: 'HP-MbfHFX9o', title: '7 Years', artist: 'Lukas Graham', thumbnail: 'https://img.youtube.com/vi/HP-MbfHFX9o/default.jpg' },
    { id: 'e-ORhEE9VVg', title: 'Titanium', artist: 'David Guetta ft. Sia', thumbnail: 'https://img.youtube.com/vi/e-ORhEE9VVg/default.jpg' },
    { id: 'YBHQbu5rbdQ', title: 'What Makes You Beautiful', artist: 'One Direction', thumbnail: 'https://img.youtube.com/vi/YBHQbu5rbdQ/default.jpg' },
    { id: 'hT_nvWreIhg', title: 'Counting Stars', artist: 'OneRepublic', thumbnail: 'https://img.youtube.com/vi/hT_nvWreIhg/default.jpg' },
];

const getMockResults = (query) => {
    if (!query || query.trim() === '') return MOCK_LIBRARY.slice(0, 10);
    const q = query.toLowerCase();
    const filtered = MOCK_LIBRARY.filter(r =>
        r.title.toLowerCase().includes(q) || r.artist.toLowerCase().includes(q)
    );
    return filtered.length > 0 ? filtered : MOCK_LIBRARY.slice(0, 8);
};

// Use the YouTube suggest API (CORS-friendly via fetch) for autocomplete
export const getSuggestions = async (query) => {
    if (!query || query.trim().length === 0) return [];

    try {
        // YouTube's suggest API (returns JSONP but we can parse it)
        const res = await fetch(
            `https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(query)}`,
            { mode: 'cors' }
        );
        const text = await res.text();
        // Response is JSONP: window.google.ac.h([...])
        // Extract the JSON array from it
        const jsonStr = text.replace(/^[^[]*(\[.*\])[^]]*$/, '$1');
        const data = JSON.parse(jsonStr);
        // data[1] contains suggestion arrays [[suggestion, ...], ...]
        if (data && data[1]) {
            return data[1].map(s => s[0]).slice(0, 8);
        }
        return [];
    } catch (e) {
        // Fallback: filter mock library for suggestions
        const q = query.toLowerCase();
        const suggestions = new Set();
        MOCK_LIBRARY.forEach(r => {
            if (r.title.toLowerCase().includes(q)) suggestions.add(r.title);
            if (r.artist.toLowerCase().includes(q)) suggestions.add(r.artist);
        });
        return [...suggestions].slice(0, 8);
    }
};

export const searchYouTube = async (query) => {
    // Fallback to mock if no key provided
    if (!API_KEY || API_KEY === 'YOUR_YOUTUBE_API_KEY') {
        console.warn('Using Mock YouTube Data. Add VITE_YOUTUBE_API_KEY to .env for real results.');
        return new Promise(resolve => {
            setTimeout(() => resolve(getMockResults(query)), 200);
        });
    }

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.error) {
            console.error('YouTube API Error:', data.error.message, '— falling back to mock results');
            return getMockResults(query);
        }

        const results = data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.default.url
        }));

        return results.length > 0 ? results : getMockResults(query);
    } catch (error) {
        console.error('Search failed:', error.message, '— falling back to mock results');
        return getMockResults(query);
    }
};
