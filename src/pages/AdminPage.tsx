import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Plus, Pencil, Trash2, ArrowLeft, Lock, Sparkles, ExternalLink } from 'lucide-react';
import { useArticles } from '../context/ArticlesContext';
import { getStoredAdminPassword, setStoredAdminPassword, clearStoredAdminPassword } from '../lib/adminAuth';
import ArticleForm, { type ArticleFormFields } from '../components/ArticleForm';
import PageHeader from '../components/PageHeader';
import type { Article } from '../types';

const GENERATOR_URL = 'https://onze-x-sete-rdt.dhanrdt.chatgpt.site/';

type View = 'list' | 'create' | 'edit' | 'generator';

export default function AdminPage() {
  const { articles, loading, refetch } = useArticles();
  const [password, setPassword] = useState(getStoredAdminPassword());
  const [unlocked, setUnlocked] = useState(!!getStoredAdminPassword());
  const [view, setView] = useState<View>('list');
  const [editing, setEditing] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [authError, setAuthError] = useState('');

  const unlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setStoredAdminPassword(password);
    setUnlocked(true);
    setAuthError('');
  };

  const lock = () => {
    clearStoredAdminPassword();
    setPassword('');
    setUnlocked(false);
  };

  const handleAuthError = () => {
    clearStoredAdminPassword();
    setUnlocked(false);
    setAuthError('Senha de administrador incorreta.');
  };

  const createArticle = async (fields: ArticleFormFields) => {
    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: getStoredAdminPassword(), ...fields }),
    });
    if (res.status === 401) {
      handleAuthError();
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
      handleAuthError();
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
        handleAuthError();
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

  if (!unlocked) {
    return (
      <div className="max-w-sm mx-auto px-4 py-24">
        <div className="text-center mb-6">
          <Lock className="text-rdt-gold mx-auto mb-3" size={32} />
          <h1 className="font-display font-bold text-white text-2xl">Área do Administrador</h1>
        </div>
        <form onSubmit={unlock} className="flex flex-col gap-3">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha de administrador"
            className="w-full bg-rdt-graphite/60 border border-white/10 rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rdt-gold"
          />
          {authError && <p className="text-red-400 text-sm text-center">{authError}</p>}
          <button
            type="submit"
            className="bg-rdt-gold text-rdt-black font-condensed font-bold uppercase tracking-wide text-sm py-2.5 rounded hover:bg-white transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => setView('list')}
          className="flex items-center gap-1.5 text-white/60 hover:text-rdt-gold text-sm mb-6"
        >
          <ArrowLeft size={16} />
          Voltar para o painel
        </button>
        <h1 className="font-display font-bold text-white text-2xl mb-6">Nova Matéria</h1>
        <ArticleForm submitLabel="Publicar matéria" onSubmit={createArticle} />
      </div>
    );
  }

  if (view === 'edit' && editing) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <h1 className="font-display font-bold text-white text-2xl mb-6">Editar Matéria</h1>
        <ArticleForm initial={editing} submitLabel="Salvar alterações" onSubmit={updateArticle} />
      </div>
    );
  }

  if (view === 'generator') {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => setView('list')}
          className="flex items-center gap-1.5 text-white/60 hover:text-rdt-gold text-sm mb-6"
        >
          <ArrowLeft size={16} />
          Voltar para o painel
        </button>

        <h1 className="font-display font-bold text-white text-2xl flex items-center gap-2 mb-4">
          <Sparkles className="text-rdt-gold" size={24} />
          Gerador de Matérias
        </h1>

        <div className="bg-rdt-graphite/50 border border-white/5 rounded-lg p-8 text-center flex flex-col items-center gap-4">
          <p className="text-white/60 text-sm max-w-md">
            Essa ferramenta usa o login do ChatGPT, que por segurança não permite ser exibida
            dentro de outro site. Abra em uma nova guia, gere a matéria por lá, e depois copie o
            título, resumo e texto para o formulário{' '}
            <button onClick={() => setView('create')} className="text-rdt-gold underline underline-offset-4">
              Nova Matéria
            </button>
            .
          </p>
          <a
            href={GENERATOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-rdt-gold text-rdt-black font-condensed font-bold uppercase tracking-wide text-sm px-4 py-2.5 rounded hover:bg-white transition-colors"
          >
            <ExternalLink size={16} />
            Abrir Gerador de Matérias
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
        <PageHeader
          icon={ShieldCheck}
          title="Painel de Administrador"
          subtitle="Crie, edite e remova matérias do portal RDT."
        />
        <div className="flex gap-2 -mt-8">
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
          <button
            onClick={lock}
            className="text-white/50 hover:text-white text-sm font-condensed uppercase tracking-wide px-3 py-2.5 border border-white/15 rounded"
          >
            Sair
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
