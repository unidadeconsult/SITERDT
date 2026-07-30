const BASE_URL = process.env.RDT_GENERATOR_BASE_URL;
const SITES_TOKEN = process.env.RDT_SITES_TOKEN;
const DRAFTS_TOKEN = process.env.RDT_DRAFTS_API_TOKEN;

function upstreamHeaders() {
  return {
    'OAI-Sites-Authorization': `Bearer ${SITES_TOKEN}`,
    'X-RDT-Authorization': `Bearer ${DRAFTS_TOKEN}`,
  };
}

export default async function handler(req, res) {
  const adminPassword = process.env.RDT_ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(500).json({ ok: false, error: 'RDT_ADMIN_PASSWORD não configurada na Vercel.' });
    return;
  }
  if (!BASE_URL || !SITES_TOKEN || !DRAFTS_TOKEN) {
    res.status(500).json({
      ok: false,
      error: 'Gerador de Matérias não configurado: defina RDT_GENERATOR_BASE_URL, RDT_SITES_TOKEN e RDT_DRAFTS_API_TOKEN na Vercel.',
    });
    return;
  }

  if (req.method === 'GET') {
    if (req.headers['x-admin-password'] !== adminPassword) {
      res.status(401).json({ ok: false, error: 'Senha de administrador incorreta.' });
      return;
    }
    try {
      const upstream = await fetch(`${BASE_URL}/api/drafts?status=pending`, {
        headers: upstreamHeaders(),
      });
      const data = await upstream.json();
      res.status(upstream.status).json(data);
    } catch {
      res.status(502).json({ ok: false, error: 'Falha ao conectar ao Gerador de Matérias.' });
    }
    return;
  }

  if (req.method === 'POST') {
    const { password, id } = req.body ?? {};
    if (password !== adminPassword) {
      res.status(401).json({ ok: false, error: 'Senha de administrador incorreta.' });
      return;
    }
    if (!id) {
      res.status(400).json({ ok: false, error: 'ID do rascunho ausente.' });
      return;
    }
    try {
      const upstream = await fetch(`${BASE_URL}/api/drafts/${encodeURIComponent(id)}/imported`, {
        method: 'POST',
        headers: upstreamHeaders(),
      });
      const data = await upstream.json();
      res.status(upstream.status).json(data);
    } catch {
      res.status(502).json({ ok: false, error: 'Falha ao marcar rascunho como importado.' });
    }
    return;
  }

  res.status(405).json({ ok: false, error: 'Method not allowed' });
}
