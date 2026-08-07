import { getRedis } from '../lib/redis.js';
import { seedPoll } from '../lib/seedPoll.js';

const META_KEY = 'rdt:poll:meta';
const VOTES_KEY = 'rdt:poll:votes';

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

async function loadPoll(redis) {
  let meta = await redis.get(META_KEY);
  if (!meta) {
    meta = { id: seedPoll.id, question: seedPoll.question, options: seedPoll.options.map((o) => ({ id: o.id, label: o.label })) };
    await redis.set(META_KEY, meta);
    const initialVotes = {};
    for (const o of seedPoll.options) initialVotes[o.id] = o.votes;
    await redis.hset(VOTES_KEY, initialVotes);
  }
  const votes = (await redis.hgetall(VOTES_KEY)) || {};
  return {
    id: meta.id,
    question: meta.question,
    options: meta.options.map((o) => ({ ...o, votes: Number(votes[o.id]) || 0 })),
  };
}

export default async function handler(req, res) {
  const redis = getRedis();

  if (!redis) {
    if (req.method === 'GET') {
      res.status(200).json(seedPoll);
      return;
    }
    res.status(500).json({
      ok: false,
      error: 'Banco de dados não configurado: defina UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN na Vercel.',
    });
    return;
  }

  if (req.method === 'GET') {
    const poll = await loadPoll(redis);
    res.status(200).json(poll);
    return;
  }

  if (req.method === 'POST') {
    const { optionId } = req.body ?? {};
    const meta = await redis.get(META_KEY);
    if (!meta || !meta.options.some((o) => o.id === optionId)) {
      res.status(400).json({ ok: false, error: 'Opção inválida.' });
      return;
    }
    await redis.hincrby(VOTES_KEY, optionId, 1);
    const poll = await loadPoll(redis);
    res.status(200).json({ ok: true, poll });
    return;
  }

  if (req.method === 'PUT') {
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
    const { question, options } = body;
    if (!question || !Array.isArray(options) || options.length < 2) {
      res.status(400).json({ ok: false, error: 'Informe a pergunta e ao menos duas opções.' });
      return;
    }
    const newOptions = options.map((label, i) => ({ id: `${slugify(label)}-${i}`, label }));
    const meta = { id: `p-${Date.now().toString(36)}`, question, options: newOptions };
    await redis.del(VOTES_KEY);
    await redis.set(META_KEY, meta);
    const initialVotes = {};
    for (const o of newOptions) initialVotes[o.id] = 0;
    await redis.hset(VOTES_KEY, initialVotes);
    const poll = await loadPoll(redis);
    res.status(200).json({ ok: true, poll });
    return;
  }

  res.status(405).json({ ok: false, error: 'Method not allowed' });
}
