import { put } from '@vercel/blob';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const adminPassword = process.env.RDT_ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(500).json({ ok: false, error: 'RDT_ADMIN_PASSWORD não configurada na Vercel.' });
    return;
  }
  if (req.headers['x-admin-password'] !== adminPassword) {
    res.status(401).json({ ok: false, error: 'Senha de administrador incorreta.' });
    return;
  }

  const filename = req.query.filename;
  if (!filename) {
    res.status(400).json({ ok: false, error: 'Nome do arquivo ausente.' });
    return;
  }

  try {
    const blob = await put(filename, req, {
      access: 'public',
      addRandomSuffix: true,
      contentType: req.headers['content-type'] || 'application/octet-stream',
    });
    res.status(200).json({ ok: true, url: blob.url });
  } catch {
    res.status(502).json({ ok: false, error: 'Falha ao enviar a imagem.' });
  }
}
