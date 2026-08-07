import { useEffect, useState } from 'react';
import { MessagesSquare, Send, Loader2 } from 'lucide-react';
import { fanPosts as initialPosts } from '../data/mockData';
import type { FanPost } from '../types';
import PageHeader from '../components/PageHeader';
import FanPostCard from '../components/FanPostCard';

export default function MuralPage() {
  const [posts, setPosts] = useState<FanPost[]>(initialPosts);
  const [text, setText] = useState('');
  const [team, setTeam] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/mural')
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setPosts(data);
      })
      .catch(() => {
        /* mantém os posts iniciais em caso de falha */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch('/api/mural', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: 'Você', team: team.trim(), text: text.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setPosts((prev) => [data.post, ...prev]);
        setText('');
        setTeam('');
      }
    } catch {
      /* falha silenciosa de rede */
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        icon={MessagesSquare}
        title="Mural da Torcida"
        subtitle="O espaço da torcida para compartilhar opiniões, relatos e paixão pelo time do coração."
      />

      <form
        onSubmit={submitPost}
        className="bg-rdt-graphite/50 border border-white/5 rounded-lg p-5 mb-8"
      >
        <label className="text-xs font-condensed uppercase tracking-wide text-white/50 mb-1 block">
          Seu time
        </label>
        <input
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          placeholder="Ex: Flamengo, Palmeiras, Grêmio..."
          className="w-full bg-rdt-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white mb-3 focus:outline-none focus:border-rdt-gold"
        />
        <label className="text-xs font-condensed uppercase tracking-wide text-white/50 mb-1 block">
          O que você está pensando?
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Compartilhe sua opinião, relato ou expectativa para o próximo jogo..."
          className="w-full bg-rdt-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-rdt-gold"
        />
        <button
          type="submit"
          disabled={sending}
          className="mt-3 flex items-center gap-2 bg-rdt-gold text-rdt-black font-condensed font-bold uppercase tracking-wide text-sm px-4 py-2.5 rounded hover:bg-white transition-colors disabled:opacity-50"
        >
          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          Publicar no mural
        </button>
      </form>

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <FanPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
