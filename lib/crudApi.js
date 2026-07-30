import { getRedis } from './redis.js';

export function createCrudHandler({ hashKey, seed, requiredFields, buildEntity, sortFn }) {
  async function loadMap(redis) {
    const map = await redis.hgetall(hashKey);
    if (map && Object.keys(map).length > 0) return map;
    const seedMap = {};
    for (const item of seed) seedMap[item.id] = item;
    if (Object.keys(seedMap).length > 0) await redis.hset(hashKey, seedMap);
    return seedMap;
  }

  return async function handler(req, res) {
    const redis = getRedis();

    if (!redis) {
      if (req.method === 'GET') {
        const items = sortFn ? seed.slice().sort(sortFn) : seed;
        res.status(200).json(items);
        return;
      }
      res.status(500).json({
        ok: false,
        error: 'Banco de dados não configurado: defina UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN na Vercel.',
      });
      return;
    }

    if (req.method === 'GET') {
      const map = await loadMap(redis);
      let items = Object.values(map);
      if (sortFn) items = items.sort(sortFn);
      res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=59');
      res.status(200).json(items);
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
      const missing = requiredFields.filter(
        (f) => body[f] === undefined || body[f] === '' || body[f] === null
      );
      if (missing.length > 0) {
        res.status(400).json({ ok: false, error: 'Preencha todos os campos obrigatórios.' });
        return;
      }
      const entity = buildEntity(body);
      await redis.hset(hashKey, { [entity.id]: entity });
      res.status(201).json({ ok: true, item: entity });
      return;
    }

    if (req.method === 'PUT') {
      const { id, ...fields } = body;
      const existing = await redis.hget(hashKey, id);
      if (!existing) {
        res.status(404).json({ ok: false, error: 'Item não encontrado.' });
        return;
      }
      const updated = { ...existing, ...fields, id };
      await redis.hset(hashKey, { [id]: updated });
      res.status(200).json({ ok: true, item: updated });
      return;
    }

    if (req.method === 'DELETE') {
      const { id } = body;
      const removed = await redis.hdel(hashKey, id);
      if (!removed) {
        res.status(404).json({ ok: false, error: 'Item não encontrado.' });
        return;
      }
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ ok: false, error: 'Method not allowed' });
  };
}
