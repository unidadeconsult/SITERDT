import { getRedis } from '../lib/redis.js';
import { seedArticles } from '../lib/seedArticles.js';

const HASH_KEY = 'rdt:articles:v3';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function findArticle(id) {
  const redis = getRedis();
  if (redis) {
    const item = await redis.hget(HASH_KEY, id);
    if (item) return item;
  }
  return seedArticles.find((a) => a.id === id) || null;
}

export default async function handler(req, res) {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  const baseHtml = await fetch(`${proto}://${host}/index.html`).then((r) => r.text());

  const article = id ? await findArticle(id) : null;

  if (!article) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(baseHtml);
    return;
  }

  const pageUrl = `${proto}://${host}/artigo/${encodeURIComponent(article.id)}`;
  const title = escapeHtml(`${article.title} — RDT Futebol`);
  const description = escapeHtml(article.dek || '');
  const image = escapeHtml(article.image || '');

  const metaTags = `
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />
    <meta property="og:site_name" content="RDT — Resenha da Torcida" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="description" content="${description}" />
  </head>`;

  const html = baseHtml
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace('</head>', metaTags);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  res.status(200).send(html);
}
