export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Missing query parameter q' });

    try {
        const response = await fetch(
            `https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(q)}`
        );
        const text = await response.text();
        const jsonStr = text.replace(/^[^[]*(\[.*\])[^]]*$/, '$1');
        const data = JSON.parse(jsonStr);
        if (data && data[1]) {
            return res.status(200).json(data[1].map(s => s[0]).slice(0, 8));
        }
        return res.status(200).json([]);
    } catch (e) {
        console.error('Suggest failed:', e.message);
        return res.status(200).json([]);
    }
}
