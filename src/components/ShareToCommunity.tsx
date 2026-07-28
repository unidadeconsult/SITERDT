import { useState } from 'react';
import { Share2, X, CheckCircle2, Loader2 } from 'lucide-react';
import type { Article } from '../types';

const communityCategory = (category: Article['category']) =>
  category === 'Crônica' ? 'OPINIÃO' : 'NOTÍCIA';

// URL pública e estável do portal, autorizada junto à Comunidade RDT.
// Não usar window.location.origin: em previews (ex: PRs) o domínio muda
// a cada branch e não está na lista de domínios autorizados da API.
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://siterdt.vercel.app';

export default function ShareToCommunity({ article }: { article: Article }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');

    try {
      const res = await fetch('/api/community-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          externalId: article.id,
          title: article.title,
          text: article.dek.slice(0, 300),
          url: `${SITE_URL}/artigo/${article.id}`,
          category: communityCategory(article.category),
          imageUrl: article.image,
          publishedAt: article.publishedAt,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        setError(data.error || 'Não foi possível compartilhar a matéria.');
        setStatus('error');
        return;
      }
      setStatus('done');
    } catch {
      setError('Falha de conexão com a Comunidade RDT.');
      setStatus('error');
    }
  };

  const close = () => {
    setOpen(false);
    setStatus('idle');
    setPassword('');
    setError('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm font-condensed font-semibold uppercase tracking-wide text-rdt-black bg-rdt-gold px-3 py-2 rounded hover:bg-white transition-colors shrink-0"
      >
        <Share2 size={16} />
        Compartilhar na Comunidade RDT
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4"
          onClick={close}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-rdt-graphite border border-rdt-gold/30 rounded-lg w-full max-w-sm p-6 relative"
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            {status === 'done' ? (
              <div className="text-center py-4">
                <CheckCircle2 className="text-emerald-400 mx-auto mb-3" size={40} />
                <h2 className="font-display font-bold text-white text-lg mb-1">
                  Compartilhado!
                </h2>
                <p className="text-white/50 text-sm">
                  A matéria já está na Comunidade RDT, chamando leitores para cá.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-display font-bold text-white text-xl mb-1">
                  Compartilhar na Comunidade RDT
                </h2>
                <p className="text-white/50 text-sm mb-5">
                  Confirme a senha de administrador para publicar esta matéria em{' '}
                  <span className="text-white/70">rdtresenhadatorcida.com.br</span>.
                </p>
                <form onSubmit={submit} className="flex flex-col gap-3">
                  <input
                    type="password"
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha de administrador"
                    className="w-full bg-rdt-black/60 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-rdt-gold"
                  />
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                  <button
                    type="submit"
                    disabled={status === 'sending' || !password}
                    className="mt-1 flex items-center justify-center gap-2 bg-rdt-gold text-rdt-black font-condensed font-bold uppercase tracking-wide text-sm py-2.5 rounded hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {status === 'sending' && <Loader2 size={16} className="animate-spin" />}
                    Publicar na comunidade
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
