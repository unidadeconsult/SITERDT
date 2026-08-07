import { getRedis } from '../lib/redis.js';

const listKey = (articleId) => `rdt:comments:${articleId}`;
const likesKey = (articleId) => `rdt:comment-likes:${articleId}`;

function relativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'agora mesmo';
  if (min < 60) return `há ${min} minuto${min === 1 ? '' : 's'}`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `há ${hr} hora${hr === 1 ? '' : 's'}`;
  const day = Math.floor(hr / 24);
  return `há ${day} dia${day === 1 ? '' : 's'}`;
}

function buildTree(flat) {
  const byId = new Map();
  flat.forEach((c) => byId.set(c.id, { ...c, replies: [] }));
  const roots = [];
  flat.forEach((c) => {
    const node = byId.get(c.id);
    if (c.parentId && byId.has(c.parentId)) {
      byId.get(c.parentId).replies.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

export default async function handler(req, res) {
  const redis = getRedis();

  if (req.method === 'GET') {
    const { articleId } = req.query;
    if (!articleId) {
      res.status(400).json({ ok: false, error: 'articleId ausente.' });
      return;
    }
    if (!redis) {
      res.status(200).json([]);
      return;
    }
    const raw = (await redis.lrange(listKey(articleId), 0, -1)) || [];
    const likes = (await redis.hgetall(likesKey(articleId))) || {};
    const flat = raw.map((c) => ({
      ...c,
      date: relativeTime(c.createdAt),
      likes: Number(likes[c.id]) || 0,
    }));
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=30');
    res.status(200).json(buildTree(flat));
    return;
  }

  if (!redis) {
    res.status(500).json({
      ok: false,
      error: 'Banco de dados não configurado: defina UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN na Vercel.',
    });
    return;
  }

  if (req.method === 'POST') {
    const { articleId, parentId, author, text } = req.body ?? {};
    if (!articleId || !author?.trim() || !text?.trim()) {
      res.status(400).json({ ok: false, error: 'Preencha todos os campos.' });
      return;
    }
    const comment = {
      id: `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      parentId: parentId || null,
      author: author.trim().slice(0, 60),
      avatar: 'https://i.pravatar.cc/150?img=68',
      createdAt: new Date().toISOString(),
      text: text.trim().slice(0, 1000),
    };
    await redis.rpush(listKey(articleId), comment);
    res.status(201).json({
      ok: true,
      comment: { ...comment, date: relativeTime(comment.createdAt), likes: 0, replies: [] },
    });
    return;
  }

  if (req.method === 'PATCH') {
    const { articleId, commentId } = req.body ?? {};
    if (!articleId || !commentId) {
      res.status(400).json({ ok: false, error: 'Dados ausentes.' });
      return;
    }
    const likes = await redis.hincrby(likesKey(articleId), commentId, 1);
    res.status(200).json({ ok: true, likes });
    return;
  }

  res.status(405).json({ ok: false, error: 'Method not allowed' });
}
