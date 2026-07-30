import { useState } from 'react';
import { Loader2, Save, Plus, X } from 'lucide-react';
import { usePoll } from '../../context/PollContext';
import { getStoredAdminPassword } from '../../lib/adminAuth';

export default function PollAdminTab({ onAuthError }: { onAuthError?: () => void }) {
  const { poll, refetch } = usePoll();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const total = poll.options.reduce((sum, o) => sum + o.votes, 0);

  const setOption = (i: number, value: string) => {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? value : o)));
  };

  const addOption = () => setOptions((prev) => [...prev, '']);
  const removeOption = (i: number) => setOptions((prev) => prev.filter((_, idx) => idx !== i));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || cleanOptions.length < 2) {
      setError('Informe a pergunta e ao menos duas opções.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/poll', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: getStoredAdminPassword(),
          question: question.trim(),
          options: cleanOptions,
        }),
      });
      if (res.status === 401) {
        onAuthError?.();
        throw new Error('Senha de administrador incorreta.');
      }
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error || 'Falha ao salvar enquete.');
      setQuestion('');
      setOptions(['', '']);
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar enquete.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-white font-display font-bold text-lg mb-3">Enquete atual</h2>
        <div className="bg-rdt-graphite/50 border border-white/5 rounded-lg p-5">
          <p className="text-white font-medium mb-3">{poll.question}</p>
          <div className="flex flex-col gap-2">
            {poll.options.map((opt) => {
              const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
              return (
                <div key={opt.id} className="flex items-center justify-between text-sm">
                  <span className="text-white/70">{opt.label}</span>
                  <span className="text-white/40">
                    {opt.votes.toLocaleString('pt-BR')} votos ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-white font-display font-bold text-lg mb-3">Publicar nova enquete</h2>
        <p className="text-white/40 text-xs mb-4">
          Isso substitui a enquete atual e zera a contagem de votos.
        </p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-condensed uppercase tracking-wide text-white/50 mb-1 block">
              Pergunta
            </label>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-rdt-black/60 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-rdt-gold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-condensed uppercase tracking-wide text-white/50 block">
              Opções
            </label>
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={opt}
                  onChange={(e) => setOption(i, e.target.value)}
                  placeholder={`Opção ${i + 1}`}
                  className="flex-1 bg-rdt-black/60 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-rdt-gold"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="p-2 text-white/40 hover:text-red-400 transition-colors"
                    aria-label="Remover opção"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="flex items-center gap-1.5 text-rdt-gold text-xs font-condensed uppercase tracking-wide w-fit mt-1"
            >
              <Plus size={14} />
              Adicionar opção
            </button>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-rdt-gold text-rdt-black font-condensed font-bold uppercase tracking-wide text-sm py-2.5 rounded hover:bg-white transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Publicar enquete
          </button>
        </form>
      </div>
    </div>
  );
}
