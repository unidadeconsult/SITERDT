import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';

export interface FieldSpec {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'select';
  options?: string[];
  half?: boolean;
}

interface SimpleEntityFormProps {
  fields: FieldSpec[];
  initial?: object;
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => Promise<void>;
}

export default function SimpleEntityForm({
  fields,
  initial,
  submitLabel,
  onSubmit,
}: SimpleEntityFormProps) {
  const initialRecord = initial as Record<string, unknown> | undefined;
  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {};
    for (const f of fields) {
      const raw = initialRecord?.[f.key];
      v[f.key] =
        raw !== undefined && raw !== null ? String(raw) : f.type === 'select' ? f.options?.[0] ?? '' : '';
    }
    return v;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key: string, val: string) => setValues((prev) => ({ ...prev, [key]: val }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.key} className={f.half ? '' : 'sm:col-span-2'}>
            <label className="text-xs font-condensed uppercase tracking-wide text-white/50 mb-1 block">
              {f.label}
            </label>
            {f.type === 'textarea' ? (
              <textarea
                value={values[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                rows={3}
                className="w-full bg-rdt-black/60 border border-white/10 rounded px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-rdt-gold"
              />
            ) : f.type === 'select' ? (
              <select
                value={values[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                className="w-full bg-rdt-black/60 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-rdt-gold"
              >
                {f.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={f.type === 'number' ? 'number' : 'text'}
                value={values[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                className="w-full bg-rdt-black/60 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-rdt-gold"
              />
            )}
          </div>
        ))}
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="flex items-center justify-center gap-2 bg-rdt-gold text-rdt-black font-condensed font-bold uppercase tracking-wide text-sm py-2.5 rounded hover:bg-white transition-colors disabled:opacity-50"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {submitLabel}
      </button>
    </form>
  );
}
