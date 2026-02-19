export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Missing query parameter q' });

    // ── Strategy 1: Piped API (multiple instances, videos filter) ────
    const pipedInstances = [
        'https://pipedapi.kavin.rocks',
        'https://pipedapi.adminforge.de',
        'https://pipedapi.in.projectsegfau.lt',
        'https://api.piped.privacydev.net',
        'https://pipedapi.darkness.services',
    ];

    // Try with "videos" filter first (more results), then "music_songs"
    const filters = ['videos', 'music_songs'];

    for (const instance of pipedInstances) {
        for (const filter of filters) {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 5000);

                const response = await fetch(
                    `${instance}/search?q=${encodeURIComponent(q + ' song')}&filter=${filter}`,
                    { signal: controller.signal }
                );
                clearTimeout(timeout);

                if (!response.ok) continue;
                const data = await response.json();
                if (!data.items || data.items.length === 0) continue;

                const results = data.items
                    .filter(item => item.type === 'stream')
                    .slice(0, 15)
                    .map(item => ({
                        id: item.url?.replace('/watch?v=', '') || '',
                        title: item.title || 'Unknown',
                        artist: item.uploaderName || 'Unknown Artist',
                        thumbnail: item.thumbnail || `https://img.youtube.com/vi/${item.url?.replace('/watch?v=', '')}/default.jpg`
                    }));

                if (results.length > 0) {
                    return res.status(200).json(results);
                }
            } catch (e) {
                continue;
            }
        }
    }

    // ── Strategy 2: Invidious API ────────────────────────────────────
    const invidiousInstances = [
        'https://invidious.nerdvpn.de',
        'https://inv.nadeko.net',
        'https://invidious.privacyredirect.com',
        'https://yewtu.be',
    ];

    for (const instance of invidiousInstances) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(
                `${instance}/api/v1/search?q=${encodeURIComponent(q)}&type=video&sort_by=relevance`,
                { signal: controller.signal }
            );
            clearTimeout(timeout);

            if (!response.ok) continue;
            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0) continue;

            const results = data.slice(0, 15).map(item => ({
                id: item.videoId || '',
                title: item.title || 'Unknown',
                artist: item.author || 'Unknown Artist',
                thumbnail: item.videoThumbnails?.[0]?.url || `https://img.youtube.com/vi/${item.videoId}/default.jpg`
            }));

            if (results.length > 0) {
                return res.status(200).json(results);
            }
        } catch (e) {
            continue;
        }
    }

    // ── Strategy 3: YouTube Data API (if key exists) ─────────────────
    const apiKey = process.env.VITE_YOUTUBE_API_KEY;
    if (apiKey && apiKey !== 'YOUR_YOUTUBE_API_KEY') {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(q)}&type=video&key=${apiKey}`
            );
            const data = await response.json();
            if (!data.error && data.items) {
                const results = data.items.map(item => ({
                    id: item.id.videoId,
                    title: item.snippet.title,
                    artist: item.snippet.channelTitle,
                    thumbnail: item.snippet.thumbnails.default.url
                }));
                if (results.length > 0) {
                    return res.status(200).json(results);
                }
            }
        } catch (e) {
            console.warn('YouTube API failed:', e.message);
        }
    }

    return res.status(200).json([]);
}
