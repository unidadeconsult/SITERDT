import { getRedis } from '../lib/redis.js';
import { seedArticles } from '../lib/seedArticles.js';

const HASH_KEY = 'rdt:articles:v3';
const LEGACY_KEY = 'rdt:articles';

function slugify(title) {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

async function loadArticlesMap(redis) {
  const map = await redis.hgetall(HASH_KEY);
  if (map && Object.keys(map).length > 0) return map;

  // Primeira leitura no novo formato: migra o array antigo (se existir) em
  // vez de simplesmente re-semear, para não perder matérias já criadas.
  const legacy = await redis.get(LEGACY_KEY);
  const base = Array.isArray(legacy) && legacy.length > 0 ? legacy : seedArticles;
  const seedMap = {};
  for (const a of base) seedMap[a.id] = a;
  await redis.hset(HASH_KEY, seedMap);
  return seedMap;
}

function sortedArticles(map) {
  return Object.values(map).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
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
    const map = await loadArticlesMap(redis);
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=59');
    res.status(200).json(sortedArticles(map));
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

  if (req.method === 'POST') {
    const { title, dek, category, author, authorAvatar, image, readTime, body: paragraphs } = body;
    if (!title || !dek || !category || !author || !image || !paragraphs?.length) {
      res.status(400).json({ ok: false, error: 'Preencha todos os campos obrigatórios.' });
      return;
    }
    const now = new Date();
    const id = `${slugify(title)}-${Date.now().toString(36)}`;
    const article = {
      id,
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
    await redis.hset(HASH_KEY, { [id]: article });
    res.status(201).json({ ok: true, article });
    return;
  }

  if (req.method === 'PUT') {
    const { id, ...fields } = body;
    const existing = await redis.hget(HASH_KEY, id);
    if (!existing) {
      res.status(404).json({ ok: false, error: 'Matéria não encontrada.' });
      return;
    }
    const updated = { ...existing, ...fields, id };
    await redis.hset(HASH_KEY, { [id]: updated });
    res.status(200).json({ ok: true, article: updated });
    return;
  }

  if (req.method === 'DELETE') {
    const { id } = body;
    const removed = await redis.hdel(HASH_KEY, id);
    if (!removed) {
      res.status(404).json({ ok: false, error: 'Matéria não encontrada.' });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ ok: false, error: 'Method not allowed' });
}
