import { useState } from 'react';
import { Heart, Reply, Send } from 'lucide-react';
import type { Comment } from '../types';

export default function CommentItem({
  comment,
  articleId,
  depth = 0,
}: {
  comment: Comment;
  articleId: string;
  depth?: number;
}) {
  const [likes, setLikes] = useState(comment.likes);
  const [liked, setLiked] = useState(false);
  const [replies, setReplies] = useState<Comment[]>(comment.replies);
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const toggleLike = async () => {
    if (liked) return;
    setLiked(true);
    setLikes((p) => p + 1);
    try {
      await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, commentId: comment.id }),
      });
    } catch {
      /* falha silenciosa de rede */
    }
  };

  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, parentId: comment.id, author: 'Você', text: text.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setReplies((prev) => [...prev, data.comment]);
        setText('');
        setShowForm(false);
      }
    } catch {
      /* falha silenciosa de rede */
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={depth > 0 ? 'pl-4 sm:pl-8 border-l border-white/5' : ''}>
      <div className="flex items-start gap-3 py-3">
        <img
          src={comment.avatar}
          alt={comment.author}
          className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-semibold">{comment.author}</span>
            <span className="text-white/30 text-xs">{comment.date}</span>
          </div>
          <p className="text-white/70 text-sm mt-1 leading-relaxed">{comment.text}</p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                liked ? 'text-rdt-gold' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Heart size={13} fill={liked ? 'currentColor' : 'none'} />
              {likes}
            </button>
            <button
              onClick={() => setShowForm((s) => !s)}
              className="flex items-center gap-1 text-xs font-medium text-white/40 hover:text-white/70 transition-colors"
            >
              <Reply size={13} />
              Responder
            </button>
          </div>

          {showForm && (
            <form onSubmit={submitReply} className="flex items-center gap-2 mt-3">
              <input
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escreva sua resposta..."
                className="flex-1 bg-rdt-black/50 border border-white/10 rounded-full px-3.5 py-1.5 text-xs text-white focus:outline-none focus:border-rdt-gold"
              />
              <button
                type="submit"
                disabled={sending}
                className="p-1.5 rounded-full bg-rdt-gold text-rdt-black hover:bg-white transition-colors disabled:opacity-50"
                aria-label="Enviar resposta"
              >
                <Send size={13} />
              </button>
            </form>
          )}

          {replies.length > 0 && (
            <div className="mt-1">
              {replies.map((r) => (
                <CommentItem key={r.id} comment={r} articleId={articleId} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
