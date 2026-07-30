import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ArrowLeft, Sparkles, ExternalLink } from 'lucide-react';
import { useArticles } from '../../context/ArticlesContext';
import { getStoredAdminPassword } from '../../lib/adminAuth';
import ArticleForm, { type ArticleFormFields } from '../ArticleForm';
import GeneratorDrafts from '../GeneratorDrafts';
import type { Article } from '../../types';

const GENERATOR_URL = 'https://onze-x-sete-rdt.dhanrdt.chatgpt.site/';

type View = 'list' | 'create' | 'edit' | 'generator';

export default function MateriasAdminTab({ onAuthError }: { onAuthError?: () => void }) {
  const { articles, loading, refetch } = useArticles();
  const [view, setView] = useState<View>('list');
  const [editing, setEditing] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const createArticle = async (fields: ArticleFormFields) => {
    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: getStoredAdminPassword(), ...fields }),
    });
    if (res.status === 401) {
      onAuthError?.();
      throw new Error('Senha de administrador incorreta.');
    }
    const data = await res.json();
    if (!res.ok || data.ok === false) throw new Error(data.error || 'Falha ao criar matéria.');
    refetch();
    setView('list');
  };

  const updateArticle = async (fields: ArticleFormFields) => {
    if (!editing) return;
    const res = await fetch('/api/articles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: getStoredAdminPassword(), id: editing.id, ...fields }),
    });
    if (res.status === 401) {
      onAuthError?.();
      throw new Error('Senha de administrador incorreta.');
    }
    const data = await res.json();
    if (!res.ok || data.ok === false) throw new Error(data.error || 'Falha ao atualizar matéria.');
    refetch();
    setView('list');
    setEditing(null);
  };

  const deleteArticle = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch('/api/articles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: getStoredAdminPassword(), id }),
      });
      if (res.status === 401) {
        onAuthError?.();
        return;
      }
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        alert(data.error || 'Falha ao excluir matéria.');
        return;
      }
      refetch();
    } finally {
      setDeleting(null);
    }
  };

  if (view === 'create') {
    return (
      <div>
        <button
          onClick={() => setView('list')}
          className="flex items-center gap-1.5 text-white/60 hover:text-rdt-gold text-sm mb-6"
        >
          <ArrowLeft size={16} />
          Voltar para o painel
        </button>
        <h2 className="font-display font-bold text-white text-2xl mb-6">Nova Matéria</h2>
        <ArticleForm submitLabel="Publicar matéria" onSubmit={createArticle} />
      </div>
    );
  }

  if (view === 'edit' && editing) {
    return (
      <div>
        <button
          onClick={() => {
            setView('list');
            setEditing(null);
          }}
          className="flex items-center gap-1.5 text-white/60 hover:text-rdt-gold text-sm mb-6"
        >
          <ArrowLeft size={16} />
          Voltar para o painel
        </button>
        <h2 className="font-display font-bold text-white text-2xl mb-6">Editar Matéria</h2>
        <ArticleForm initial={editing} submitLabel="Salvar alterações" onSubmit={updateArticle} />
      </div>
    );
  }

  if (view === 'generator') {
    return (
      <div>
        <button
          onClick={() => setView('list')}
          className="flex items-center gap-1.5 text-white/60 hover:text-rdt-gold text-sm mb-6"
        >
          <ArrowLeft size={16} />
          Voltar para o painel
        </button>

        <h2 className="font-display font-bold text-white text-2xl flex items-center gap-2 mb-4">
          <Sparkles className="text-rdt-gold" size={24} />
          Gerador de Matérias
        </h2>

        <div className="bg-rdt-graphite/50 border border-white/5 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <p className="text-white/60 text-sm">
            Essa ferramenta usa o login do ChatGPT, que por segurança não permite ser exibida
            dentro de outro site. Gere a matéria lá — assim que estiver com status "Pronto", ela
            aparece na lista abaixo para importar com um clique.
          </p>
          <a
            href={GENERATOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-rdt-gold text-rdt-black font-condensed font-bold uppercase tracking-wide text-sm px-4 py-2.5 rounded hover:bg-white transition-colors shrink-0"
          >
            <ExternalLink size={16} />
            Abrir Gerador
          </a>
        </div>

        <GeneratorDrafts onImported={refetch} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <p className="text-white/50 text-sm">
          {articles.length} matéria{articles.length === 1 ? '' : 's'} publicada
          {articles.length === 1 ? '' : 's'}.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setView('generator')}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-condensed font-semibold uppercase tracking-wide text-sm px-4 py-2.5 rounded transition-colors"
          >
            <Sparkles size={16} />
            Gerador de Matérias
          </button>
          <button
            onClick={() => setView('create')}
            className="flex items-center gap-2 bg-rdt-gold text-rdt-black font-condensed font-bold uppercase tracking-wide text-sm px-4 py-2.5 rounded hover:bg-white transition-colors"
          >
            <Plus size={16} />
            Nova Matéria
          </button>
        </div>
      </div>

      {loading && <p className="text-white/40 text-sm">Carregando matérias...</p>}

      <div className="flex flex-col divide-y divide-white/5 border-t border-white/5">
        {articles.map((article) => (
          <div key={article.id} className="flex items-center justify-between gap-4 py-4">
            <div className="min-w-0">
              <Link
                to={`/artigo/${article.id}`}
                className="text-white font-semibold hover:text-rdt-gold transition-colors truncate block"
              >
                {article.title}
              </Link>
              <p className="text-white/40 text-xs mt-1">
                {article.category} · {article.author} · {article.date}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setEditing(article);
                  setView('edit');
                }}
                className="p-2 rounded border border-white/10 text-white/60 hover:text-rdt-gold hover:border-rdt-gold/40 transition-colors"
                aria-label="Editar"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Excluir "${article.title}"? Essa ação não pode ser desfeita.`)) {
                    deleteArticle(article.id);
                  }
                }}
                disabled={deleting === article.id}
                className="p-2 rounded border border-white/10 text-white/60 hover:text-red-400 hover:border-red-400/40 transition-colors disabled:opacity-40"
                aria-label="Excluir"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
