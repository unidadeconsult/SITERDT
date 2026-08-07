import { useEffect, useState } from 'react';
import { Download, Loader2, RefreshCw } from 'lucide-react';
import { getStoredAdminPassword } from '../lib/adminAuth';
import { categories } from './ArticleForm';
import type { GeneratorDraft } from '../types';

interface GeneratorDraftsProps {
  onImported: () => void;
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80';

function estimateReadTime(body: string[]) {
  const words = body.join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function GeneratorDrafts({ onImported }: GeneratorDraftsProps) {
  const [drafts, setDrafts] = useState<GeneratorDraft[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [importingId, setImportingId] = useState<string | null>(null);

  const fetchDrafts = () => {
    setStatus('loading');
    setError('');
    fetch('/api/drafts', {
      headers: { 'X-Admin-Password': getStoredAdminPassword() },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || data.ok === false) {
          throw new Error(data.error || 'Falha ao buscar matérias pendentes.');
        }
        setDrafts(Array.isArray(data.items) ? data.items : []);
        setStatus('ready');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Falha ao buscar matérias pendentes.');
        setStatus('error');
      });
  };

  useEffect(() => {
    fetchDrafts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const importDraft = async (draft: GeneratorDraft) => {
    setImportingId(draft.id);
    const password = getStoredAdminPassword();
    try {
      const category = categories.includes(draft.category as (typeof categories)[number])
        ? draft.category
        : categories[0];

      const createRes = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          title: draft.title,
          dek: draft.dek,
          category,
          author: 'Redação RDT',
          authorAvatar: '',
          image: draft.imageUrl || DEFAULT_IMAGE,
          readTime: estimateReadTime(draft.body),
          body: draft.body,
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok || createData.ok === false) {
        throw new Error(createData.error || 'Falha ao criar a matéria.');
      }

      await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, id: draft.id }),
      });

      setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
      onImported();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Falha ao importar matéria.');
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-white/50 text-sm">
          Matérias prontas no Gerador, aguardando importação.
        </p>
        <button
          onClick={fetchDrafts}
          disabled={status === 'loading'}
          className="flex items-center gap-1.5 text-white/60 hover:text-rdt-gold text-xs font-condensed uppercase tracking-wide transition-colors disabled:opacity-50"
        >
          <RefreshCw size={13} className={status === 'loading' ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      {status === 'loading' && <p className="text-white/40 text-sm">Buscando matérias...</p>}
      {status === 'error' && <p className="text-red-400 text-sm">{error}</p>}
      {status === 'ready' && drafts.length === 0 && (
        <p className="text-white/40 text-sm">Nenhuma matéria pendente no momento.</p>
      )}

      <div className="flex flex-col gap-3">
        {drafts.map((draft) => (
          <div
            key={draft.id}
            className="flex items-center justify-between gap-4 bg-rdt-graphite/50 border border-white/5 rounded-lg p-4"
          >
            <div className="min-w-0 flex items-center gap-3">
              {draft.imageUrl && (
                <img
                  src={draft.imageUrl}
                  alt=""
                  className="w-14 h-14 object-cover rounded border border-white/10 shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-white font-semibold truncate">{draft.title}</p>
                <p className="text-white/40 text-xs mt-0.5 truncate">
                  {draft.category} · {draft.dek}
                </p>
              </div>
            </div>
            <button
              onClick={() => importDraft(draft)}
              disabled={importingId === draft.id}
              className="flex items-center gap-2 bg-rdt-gold text-rdt-black font-condensed font-bold uppercase tracking-wide text-xs px-3 py-2 rounded hover:bg-white transition-colors disabled:opacity-50 shrink-0"
            >
              {importingId === draft.id ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              Importar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
