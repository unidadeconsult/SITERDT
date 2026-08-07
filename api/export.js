import { getRedis } from '../lib/redis.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const adminPassword = process.env.RDT_ADMIN_PASSWORD;
  const body = req.body ?? {};
  if (!adminPassword) {
    res.status(500).json({ ok: false, error: 'RDT_ADMIN_PASSWORD não configurada na Vercel.' });
    return;
  }
  if (body.password !== adminPassword) {
    res.status(401).json({ ok: false, error: 'Senha de administrador incorreta.' });
    return;
  }

  const redis = getRedis();
  if (!redis) {
    res.status(500).json({
      ok: false,
      error: 'Banco de dados não configurado: defina UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN na Vercel.',
    });
    return;
  }

  const articlesMap = (await redis.hgetall('rdt:articles:v3')) || {};
  const ticker = Object.values((await redis.hgetall('rdt:ticker')) || {});
  const transfers = Object.values((await redis.hgetall('rdt:transfers')) || {});
  const onthisday = Object.values((await redis.hgetall('rdt:onthisday')) || {});
  const pollMeta = await redis.get('rdt:poll:meta');
  const pollVotes = (await redis.hgetall('rdt:poll:votes')) || {};

  const articles = Object.values(articlesMap);

  const comments = {};
  for (const article of articles) {
    const raw = (await redis.lrange(`rdt:comments:${article.id}`, 0, -1)) || [];
    const likes = (await redis.hgetall(`rdt:comment-likes:${article.id}`)) || {};
    if (raw.length > 0) {
      comments[article.id] = raw.map((c) => ({ ...c, likes: Number(likes[c.id]) || 0 }));
    }
  }

  const rawPosts = (await redis.lrange('rdt:mural:posts', 0, -1)) || [];
  const postLikes = (await redis.hgetall('rdt:mural:likes')) || {};
  const mural = await Promise.all(
    rawPosts.map(async (p) => {
      const rawReplies = (await redis.lrange(`rdt:mural:replies:${p.id}`, 0, -1)) || [];
      return { ...p, likes: Number(postLikes[p.id]) || 0, replies: rawReplies };
    })
  );

  const dump = {
    exportedAt: new Date().toISOString(),
    articles,
    ticker,
    transfers,
    onthisday,
    poll: pollMeta ? { ...pollMeta, votes: pollVotes } : null,
    comments,
    mural,
  };

  res.status(200).json({ ok: true, dump });
}
