export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Missing query parameter q' });

    // Piped API instances to try
    const instances = [
        'https://pipedapi.kavin.rocks',
        'https://pipedapi.adminforge.de',
        'https://pipedapi.in.projectsegfau.lt',
    ];

    for (const instance of instances) {
        try {
            const response = await fetch(
                `${instance}/search?q=${encodeURIComponent(q)}&filter=music_songs`,
                { signal: AbortSignal.timeout(5000) }
            );
            if (!response.ok) continue;
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                const results = data.items
                    .filter(item => item.type === 'stream')
                    .slice(0, 15)
                    .map(item => ({
                        id: item.url?.replace('/watch?v=', '') || '',
                        title: item.title || 'Unknown',
                        artist: item.uploaderName || 'Unknown Artist',
                        thumbnail: item.thumbnail || `https://img.youtube.com/vi/${item.url?.replace('/watch?v=', '')}/default.jpg`
                    }));
                return res.status(200).json(results);
            }
        } catch (e) {
            console.warn(`Piped ${instance} failed:`, e.message);
            continue;
        }
    }

    // Fallback: try YouTube Data API if key exists
    const apiKey = process.env.VITE_YOUTUBE_API_KEY;
    if (apiKey && apiKey !== 'YOUR_YOUTUBE_API_KEY') {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(q)}&type=video&videoCategoryId=10&key=${apiKey}`
            );
            const data = await response.json();
            if (!data.error && data.items) {
                const results = data.items.map(item => ({
                    id: item.id.videoId,
                    title: item.snippet.title,
                    artist: item.snippet.channelTitle,
                    thumbnail: item.snippet.thumbnails.default.url
                }));
                return res.status(200).json(results);
            }
        } catch (e) {
            console.warn('YouTube API failed:', e.message);
        }
    }

    return res.status(200).json([]);
}
