import { useEffect, useState } from 'react';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import type { Comment } from '../types';
import CommentItem from './CommentItem';

export default function CommentSection({
  articleId,
  initialComments,
}: {
  articleId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/comments?articleId=${encodeURIComponent(articleId)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setComments(data);
      })
      .catch(() => {
        /* mantém os comentários iniciais em caso de falha */
      });
    return () => {
      cancelled = true;
    };
  }, [articleId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, author: 'Você', text: text.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setComments((prev) => [data.comment, ...prev]);
        setText('');
      } else if (res.status === 429) {
        alert(data.error || 'Muitos comentários em pouco tempo. Aguarde um instante.');
      }
    } catch {
      /* falha silenciosa de rede */
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="mt-10 pt-8 border-t border-white/10">
      <div className="flex items-center gap-2 mb-5">
        <MessageCircle className="text-rdt-gold" size={22} />
        <h2 className="font-display font-bold text-white text-xl">
          Comentários ({comments.length})
        </h2>
      </div>

      <form onSubmit={submit} className="flex items-start gap-3 mb-4">
        <img
          src="https://i.pravatar.cc/150?img=68"
          alt="Você"
          className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
        />
        <div className="flex-1 flex gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={1}
            placeholder="Deixe seu comentário sobre a matéria..."
            className="flex-1 bg-rdt-graphite/50 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white resize-none focus:outline-none focus:border-rdt-gold"
          />
          <button
            type="submit"
            disabled={sending}
            className="p-2.5 rounded-lg bg-rdt-gold text-rdt-black hover:bg-white transition-colors shrink-0 disabled:opacity-50"
            aria-label="Enviar comentário"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </form>

      <div className="flex flex-col divide-y divide-white/5">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} articleId={articleId} />
        ))}
        {comments.length === 0 && (
          <p className="text-white/40 text-sm py-6 text-center">
            Seja o primeiro a comentar essa matéria.
          </p>
        )}
      </div>
    </section>
  );
}
