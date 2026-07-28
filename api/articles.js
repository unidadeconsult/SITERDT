import { getRedis } from '../lib/redis.js';
import { seedArticles } from '../lib/seedArticles.js';

const KEY = 'rdt:articles';

function slugify(title) {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

async function loadArticles(redis) {
  const stored = await redis.get(KEY);
  if (stored && Array.isArray(stored)) return stored;
  await redis.set(KEY, seedArticles);
  return seedArticles;
}

export default async function handler(req, res) {
  const redis = getRedis();

  if (!redis) {
    if (req.method === 'GET') {
      res.status(200).json(seedArticles);
      return;
    }
    res.status(500).json({
      ok: false,
      error: 'Banco de dados não configurado: defina UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN na Vercel.',
    });
    return;
  }

  if (req.method === 'GET') {
    const articles = await loadArticles(redis);
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=59');
    res.status(200).json(articles);
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

  const articles = await loadArticles(redis);

  if (req.method === 'POST') {
    const { title, dek, category, author, authorAvatar, image, readTime, body: paragraphs } = body;
    if (!title || !dek || !category || !author || !image || !paragraphs?.length) {
      res.status(400).json({ ok: false, error: 'Preencha todos os campos obrigatórios.' });
      return;
    }
    const now = new Date();
    const article = {
      id: `${slugify(title)}-${Date.now().toString(36)}`,
      title,
      dek,
      category,
      author,
      authorAvatar: authorAvatar || 'https://i.pravatar.cc/150?img=68',
      date: now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
      publishedAt: now.toISOString(),
      readTime: Number(readTime) || 4,
      image,
      body: paragraphs,
      comments: [],
    };
    const next = [article, ...articles];
    await redis.set(KEY, next);
    res.status(201).json({ ok: true, article });
    return;
  }

  if (req.method === 'PUT') {
    const { id, ...fields } = body;
    const index = articles.findIndex((a) => a.id === id);
    if (index === -1) {
      res.status(404).json({ ok: false, error: 'Matéria não encontrada.' });
      return;
    }
    const updated = { ...articles[index], ...fields, id };
    const next = [...articles];
    next[index] = updated;
    await redis.set(KEY, next);
    res.status(200).json({ ok: true, article: updated });
    return;
  }

  if (req.method === 'DELETE') {
    const { id } = body;
    const next = articles.filter((a) => a.id !== id);
    if (next.length === articles.length) {
      res.status(404).json({ ok: false, error: 'Matéria não encontrada.' });
      return;
    }
    await redis.set(KEY, next);
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ ok: false, error: 'Method not allowed' });
}
