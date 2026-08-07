import { getRedis } from '../lib/redis.js';
import { clientIp, checkRateLimit } from '../lib/rateLimit.js';

const POSTS_KEY = 'rdt:mural:posts';
const LIKES_KEY = 'rdt:mural:likes';
const repliesKey = (postId) => `rdt:mural:replies:${postId}`;

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

export default async function handler(req, res) {
  const redis = getRedis();

  if (req.method === 'GET') {
    if (!redis) {
      res.status(200).json([]);
      return;
    }
    const rawPosts = (await redis.lrange(POSTS_KEY, 0, -1)) || [];
    const likes = (await redis.hgetall(LIKES_KEY)) || {};
    const posts = await Promise.all(
      rawPosts
        .slice()
        .reverse()
        .map(async (p) => {
          const rawReplies = (await redis.lrange(repliesKey(p.id), 0, -1)) || [];
          return {
            ...p,
            date: relativeTime(p.createdAt),
            likes: Number(likes[p.id]) || 0,
            replies: rawReplies.map((r) => ({ ...r, date: relativeTime(r.createdAt) })),
          };
        })
    );
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=30');
    res.status(200).json(posts);
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
    const { postId, author, team, text } = req.body ?? {};
    if (!author?.trim() || !text?.trim()) {
      res.status(400).json({ ok: false, error: 'Preencha todos os campos.' });
      return;
    }
    const allowed = await checkRateLimit(redis, `rdt:ratelimit:mural-post:${clientIp(req)}`, 5, 60);
    if (!allowed) {
      res.status(429).json({ ok: false, error: 'Muitas publicações em pouco tempo. Aguarde um instante.' });
      return;
    }

    if (postId) {
      const reply = {
        id: `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        author: author.trim().slice(0, 60),
        avatar: 'https://i.pravatar.cc/150?img=68',
        createdAt: new Date().toISOString(),
        text: text.trim().slice(0, 1000),
      };
      await redis.rpush(repliesKey(postId), reply);
      res.status(201).json({ ok: true, reply: { ...reply, date: relativeTime(reply.createdAt) } });
      return;
    }

    const post = {
      id: `post-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      author: author.trim().slice(0, 60),
      avatar: 'https://i.pravatar.cc/150?img=68',
      team: team?.trim().slice(0, 60) || 'Torcedor RDT',
      createdAt: new Date().toISOString(),
      text: text.trim().slice(0, 1000),
    };
    await redis.rpush(POSTS_KEY, post);
    res.status(201).json({
      ok: true,
      post: { ...post, date: relativeTime(post.createdAt), likes: 0, replies: [] },
    });
    return;
  }

  if (req.method === 'PATCH') {
    const { postId } = req.body ?? {};
    if (!postId) {
      res.status(400).json({ ok: false, error: 'Dados ausentes.' });
      return;
    }
    const allowed = await checkRateLimit(redis, `rdt:ratelimit:mural-like:${clientIp(req)}`, 30, 60);
    if (!allowed) {
      res.status(429).json({ ok: false, error: 'Muitas curtidas em pouco tempo. Aguarde um instante.' });
      return;
    }
    const likes = await redis.hincrby(LIKES_KEY, postId, 1);
    res.status(200).json({ ok: true, likes });
    return;
  }

  res.status(405).json({ ok: false, error: 'Method not allowed' });
}
