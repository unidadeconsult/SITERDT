import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import type { Article, Category } from '../types';
import ImageUploadField from './ImageUploadField';

export const categories: Category[] = [
  'Brasileirão',
  'Libertadores',
  'Seleção',
  'Europa',
  'Copa do Brasil',
  'Crônica',
];

export interface ArticleFormFields {
  title: string;
  dek: string;
  category: Category;
  author: string;
  authorAvatar: string;
  image: string;
  readTime: number;
  body: string[];
}

interface ArticleFormProps {
  initial?: Article;
  submitLabel: string;
  onSubmit: (fields: ArticleFormFields) => Promise<void>;
}

export default function ArticleForm({ initial, submitLabel, onSubmit }: ArticleFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [dek, setDek] = useState(initial?.dek ?? '');
  const [category, setCategory] = useState<Category>(initial?.category ?? 'Brasileirão');
  const [author, setAuthor] = useState(initial?.author ?? '');
  const [authorAvatar, setAuthorAvatar] = useState(initial?.authorAvatar ?? '');
  const [image, setImage] = useState(initial?.image ?? '');
  const [readTime, setReadTime] = useState(initial?.readTime ?? 4);
  const [bodyText, setBodyText] = useState(initial?.body?.join('\n\n') ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const paragraphs = bodyText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (!title || !dek || !author || !image || paragraphs.length === 0) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    setSaving(true);
    try {
      await onSubmit({ title, dek, category, author, authorAvatar, image, readTime, body: paragraphs });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar a matéria.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-condensed uppercase tracking-wide text-white/50 mb-1 block">
          Título *
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-rdt-black/60 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-rdt-gold"
        />
      </div>

      <div>
        <label className="text-xs font-condensed uppercase tracking-wide text-white/50 mb-1 block">
          Subtítulo / Resumo *
        </label>
        <textarea
          value={dek}
          onChange={(e) => setDek(e.target.value)}
          rows={2}
          className="w-full bg-rdt-black/60 border border-white/10 rounded px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-rdt-gold"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-condensed uppercase tracking-wide text-white/50 mb-1 block">
            Categoria
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full bg-rdt-black/60 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-rdt-gold"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-condensed uppercase tracking-wide text-white/50 mb-1 block">
            Tempo de leitura (min)
          </label>
          <input
            type="number"
            min={1}
            value={readTime}
            onChange={(e) => setReadTime(Number(e.target.value))}
            className="w-full bg-rdt-black/60 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-rdt-gold"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-condensed uppercase tracking-wide text-white/50 mb-1 block">
            Autor *
          </label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full bg-rdt-black/60 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-rdt-gold"
          />
        </div>
        <ImageUploadField
          label="Avatar do autor"
          hint="ideal: 400×400px, quadrada"
          value={authorAvatar}
          onChange={setAuthorAvatar}
          round
        />
      </div>

      <ImageUploadField
        label="Imagem de capa"
        hint="ideal: 1600×900px (16:9)"
        value={image}
        onChange={setImage}
        required
      />

      <div>
        <label className="text-xs font-condensed uppercase tracking-wide text-white/50 mb-1 block">
          Texto da matéria * (separe os parágrafos com uma linha em branco)
        </label>
        <textarea
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          rows={10}
          className="w-full bg-rdt-black/60 border border-white/10 rounded px-3 py-2 text-white text-sm resize-y focus:outline-none focus:border-rdt-gold"
        />
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
