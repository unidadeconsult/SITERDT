const COMMUNITY_ENDPOINT = 'https://rdtresenhadatorcida.com.br/api/integrations/community/posts';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const params = new URLSearchParams();
  const { limit, category, featured, before } = req.query;
  if (limit) params.set('limit', String(limit));
  if (category) params.set('category', String(category));
  if (featured) params.set('featured', String(featured));
  if (before) params.set('before', String(before));

  try {
    const upstream = await fetch(`${COMMUNITY_ENDPOINT}?${params.toString()}`);
    const data = await upstream.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(upstream.status).json(data);
  } catch {
    res.status(200).json({
      apiVersion: '1',
      items: [],
      pagination: { limit: Number(limit) || 12, hasMore: false, nextCursor: null },
      updatedAt: new Date().toISOString(),
    });
  }
}
