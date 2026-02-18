const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const MOCK_RESULTS = [
    { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', artist: 'Rick Astley', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg' },
    { id: 'kJQP7kiw5Fk', title: 'Despacito', artist: 'Luis Fonsi', thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/default.jpg' },
    { id: 'L_jWHffIx5E', title: 'All Star', artist: 'Smash Mouth', thumbnail: 'https://img.youtube.com/vi/L_jWHffIx5E/default.jpg' },
    { id: 'fJ9rUzIMcZQ', title: 'Bohemian Rhapsody', artist: 'Queen', thumbnail: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/default.jpg' },
    { id: 'hTWCb5ctq0s', title: 'One More Time', artist: 'Daft Punk', thumbnail: 'https://img.youtube.com/vi/hTWCb5ctq0s/default.jpg' },
    { id: '9bZkp7q19f0', title: 'Gangnam Style', artist: 'PSY', thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/default.jpg' },
    { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', thumbnail: 'https://img.youtube.com/vi/JGwWNGJdvx8/default.jpg' },
    { id: 'RgKAFK5djSk', title: 'See You Again', artist: 'Wiz Khalifa ft. Charlie Puth', thumbnail: 'https://img.youtube.com/vi/RgKAFK5djSk/default.jpg' },
];

const getMockResults = (query) => {
    const q = query.toLowerCase();
    const filtered = MOCK_RESULTS.filter(r =>
        r.title.toLowerCase().includes(q) || r.artist.toLowerCase().includes(q)
    );
    return filtered.length > 0 ? filtered : MOCK_RESULTS;
};

export const searchYouTube = async (query) => {
    // Fallback to mock if no key provided
    if (!API_KEY || API_KEY === 'YOUR_YOUTUBE_API_KEY') {
        console.warn('Using Mock YouTube Data. Add VITE_YOUTUBE_API_KEY to .env for real results.');
        return new Promise(resolve => {
            setTimeout(() => resolve(getMockResults(query)), 400);
        });
    }

    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`);
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
