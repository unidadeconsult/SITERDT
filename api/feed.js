import { getRedis } from '../lib/redis.js';
import { seedArticles } from '../lib/seedArticles.js';
import { clientIp, checkRateLimit } from '../lib/rateLimit.js';

const ARTICLES_KEY = 'rdt:articles:v3';
const NEWSLETTER_KEY = 'rdt:newsletter:subscribers';

const STATIC_PATHS = [
  '/',
  '/mercado-da-bola',
  '/neste-dia-no-futebol',
  '/mural-da-torcida',
  '/colunas',
  '/prancheta-tatica',
];

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function siteUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${req.headers.host}`;
}

async function loadArticles(redis) {
  let list = seedArticles;
  if (redis) {
    const map = await redis.hgetall(ARTICLES_KEY);
    if (map && Object.keys(map).length > 0) list = Object.values(map);
  }
  return list
    .slice()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

async function sendSitemap(req, res, redis) {
  const base = siteUrl(req);
  const articles = await loadArticles(redis);
  const urls = [
    ...STATIC_PATHS.map((p) => `  <url><loc>${escapeXml(base + p)}</loc></url>`),
    ...articles.map(
      (a) =>
        `  <url><loc>${escapeXml(`${base}/artigo/${a.id}`)}</loc><lastmod>${new Date(
          a.publishedAt
        )
          .toISOString()
          .slice(0, 10)}</lastmod></url>`
    ),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}

async function sendRss(req, res, redis) {
  const base = siteUrl(req);
  const articles = (await loadArticles(redis)).slice(0, 30);
  const items = articles
    .map(
      (a) => `  <item>
    <title>${escapeXml(a.title)}</title>
    <link>${escapeXml(`${base}/artigo/${a.id}`)}</link>
    <guid>${escapeXml(`${base}/artigo/${a.id}`)}</guid>
    <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
    <description>${escapeXml(a.dek || '')}</description>
  </item>`
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>RDT — Resenha da Torcida</title>
  <link>${escapeXml(base)}</link>
  <description>Jornalismo esportivo, memória e crônica do futebol brasileiro e internacional.</description>
  <language>pt-BR</language>
${items}
</channel></rss>`;
  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}

async function handleNewsletter(req, res, redis) {
  if (req.method === 'POST') {
    if (!redis) {
      res.status(500).json({
        ok: false,
        error: 'Banco de dados não configurado: defina UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN na Vercel.',
      });
      return;
    }
    const { email } = req.body ?? {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ ok: false, error: 'Informe um e-mail válido.' });
      return;
    }
    const allowed = await checkRateLimit(redis, `rdt:ratelimit:newsletter:${clientIp(req)}`, 3, 60);
    if (!allowed) {
      res.status(429).json({ ok: false, error: 'Muitas tentativas. Aguarde um instante.' });
      return;
    }
    await redis.sadd(NEWSLETTER_KEY, email.trim().toLowerCase());
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === 'GET') {
    const adminPassword = process.env.RDT_ADMIN_PASSWORD;
    if (!adminPassword || req.headers['x-admin-password'] !== adminPassword) {
      res.status(401).json({ ok: false, error: 'Senha de administrador incorreta.' });
      return;
    }
    if (!redis) {
      res.status(200).json({ ok: true, subscribers: [] });
      return;
    }
    const subscribers = (await redis.smembers(NEWSLETTER_KEY)) || [];
    res.status(200).json({ ok: true, subscribers });
    return;
  }

  res.status(405).json({ ok: false, error: 'Method not allowed' });
}

export default async function handler(req, res) {
  const redis = getRedis();
  const type = Array.isArray(req.query.type) ? req.query.type[0] : req.query.type;

  if (type === 'sitemap') {
    await sendSitemap(req, res, redis);
    return;
  }
  if (type === 'rss') {
    await sendRss(req, res, redis);
    return;
  }
  if (type === 'newsletter') {
    await handleNewsletter(req, res, redis);
    return;
  }

  res.status(400).json({ ok: false, error: 'Tipo de feed inválido.' });
}
