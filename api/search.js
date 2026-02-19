export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Missing query parameter q' });

    // ── Strategy 1: Scrape YouTube search results directly ───────────
    try {
        const results = await scrapeYouTubeSearch(q);
        if (results.length > 0) {
            return res.status(200).json(results);
        }
    } catch (e) {
        console.warn('YouTube scrape failed:', e.message);
    }

    // ── Strategy 2: Piped API (fallback) ─────────────────────────────
    const pipedInstances = [
        'https://pipedapi.kavin.rocks',
        'https://pipedapi.adminforge.de',
    ];
    for (const instance of pipedInstances) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 4000);
            const response = await fetch(
                `${instance}/search?q=${encodeURIComponent(q)}&filter=videos`,
                { signal: controller.signal }
            );
            clearTimeout(timeout);
            if (!response.ok) continue;
            const data = await response.json();
            if (!data.items || data.items.length === 0) continue;
            const results = data.items
                .filter(i => i.type === 'stream')
                .slice(0, 15)
                .map(i => ({
                    id: i.url?.replace('/watch?v=', '') || '',
                    title: i.title || 'Unknown',
                    artist: i.uploaderName || 'Unknown Artist',
                    thumbnail: i.thumbnail || `https://img.youtube.com/vi/${i.url?.replace('/watch?v=', '')}/default.jpg`
                }));
            if (results.length > 0) return res.status(200).json(results);
        } catch { continue; }
    }

    // ── Strategy 3: YouTube Data API ─────────────────────────────────
    const apiKey = process.env.VITE_YOUTUBE_API_KEY;
    if (apiKey && apiKey !== 'YOUR_YOUTUBE_API_KEY') {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(q)}&type=video&key=${apiKey}`
            );
            const data = await response.json();
            if (!data.error && data.items) {
                return res.status(200).json(data.items.map(item => ({
                    id: item.id.videoId,
                    title: item.snippet.title,
                    artist: item.snippet.channelTitle,
                    thumbnail: item.snippet.thumbnails.default.url
                })));
            }
        } catch { /* fall through */ }
    }

    return res.status(200).json([]);
}

// Scrape YouTube search page directly (no API key needed, always works)
async function scrapeYouTubeSearch(query) {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
        }
    });

    if (!response.ok) throw new Error(`YouTube returned ${response.status}`);

    const html = await response.text();

    // Extract the ytInitialData JSON from the page
    const dataMatch = html.match(/var ytInitialData = ({.*?});<\/script>/s);
    if (!dataMatch) throw new Error('Could not find ytInitialData');

    const data = JSON.parse(dataMatch[1]);

    // Navigate the deeply nested YouTube JSON structure
    const contents = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
    if (!contents) throw new Error('Could not parse YouTube structure');

    const results = [];

    for (const section of contents) {
        const items = section?.itemSectionRenderer?.contents;
        if (!items) continue;

        for (const item of items) {
            const video = item?.videoRenderer;
            if (!video || !video.videoId) continue;

            results.push({
                id: video.videoId,
                title: video.title?.runs?.[0]?.text || 'Unknown',
                artist: video.ownerText?.runs?.[0]?.text || 'Unknown Artist',
                thumbnail: `https://img.youtube.com/vi/${video.videoId}/default.jpg`
            });

            if (results.length >= 15) break;
        }
        if (results.length >= 15) break;
    }

    return results;
}
