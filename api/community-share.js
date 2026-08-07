const COMMUNITY_ENDPOINT = 'https://rdtresenhadatorcida.com.br/api/integrations/community/posts';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const adminPassword = process.env.RDT_ADMIN_PASSWORD;
  const apiKey = process.env.RDT_COMMUNITY_API_KEY;

  if (!adminPassword || !apiKey) {
    res.status(500).json({
      ok: false,
      error: 'Servidor não configurado: defina RDT_ADMIN_PASSWORD e RDT_COMMUNITY_API_KEY nas variáveis de ambiente da Vercel.',
    });
    return;
  }

  const { password, externalId, title, text, url, category, imageUrl, publishedAt } = req.body ?? {};

  if (password !== adminPassword) {
    res.status(401).json({ ok: false, error: 'Senha de administrador incorreta.' });
    return;
  }

  if (!externalId || !title || !text || !url) {
    res.status(400).json({ ok: false, error: 'Campos obrigatórios ausentes.' });
    return;
  }

  if (text.length > 300) {
    res.status(400).json({ ok: false, error: 'O texto excede 300 caracteres.' });
    return;
  }

  try {
    const upstream = await fetch(COMMUNITY_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        externalId,
        title,
        text,
        url,
        category,
        imageUrl,
        publishedAt,
      }),
    });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch {
    res.status(502).json({ ok: false, error: 'Falha ao conectar com a Comunidade RDT.' });
  }
}
