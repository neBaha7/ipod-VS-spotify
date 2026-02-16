const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const searchYouTube = async (query) => {
    // Fallback to mock if no key provided
    if (!API_KEY || API_KEY === 'YOUR_YOUTUBE_API_KEY') {
        console.warn('Using Mock YouTube Data. Add VITE_YOUTUBE_API_KEY to .env for real results.');
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', artist: 'Rick Astley', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg' },
                    { id: 'kJQP7kiw5Fk', title: 'Despacito', artist: 'Luis Fonsi', thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/default.jpg' },
                    { id: 'L_jWHffIx5E', title: 'Smash Mouth - All Star', artist: 'Smash Mouth', thumbnail: 'https://img.youtube.com/vi/L_jWHffIx5E/default.jpg' },
                    { id: 'fJ9rUzIMcZQ', title: 'Queen - Bohemian Rhapsody', artist: 'Queen', thumbnail: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/default.jpg' },
                    { id: 'hTWCb5ctq0s', title: 'Daft Punk - One More Time', artist: 'Daft Punk', thumbnail: 'https://img.youtube.com/vi/hTWCb5ctq0s/default.jpg' },
                ]);
            }, 500);
        });
    }

    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`);
        const data = await response.json();

        if (data.error) {
            console.error('YouTube API Error:', data.error);
            throw new Error(data.error.message);
        }

        return data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.default.url
        }));
    } catch (error) {
        console.error('Search failed:', error);
        return [];
    }
};
