import { useState } from 'react';
import { Heart, MessageCircle, Send, Loader2 } from 'lucide-react';
import type { Comment, FanPost } from '../types';

export default function FanPostCard({ post }: { post: FanPost }) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const [replies, setReplies] = useState<Comment[]>(post.replies);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const toggleLike = async () => {
    if (liked) return;
    setLiked(true);
    setLikes((prev) => prev + 1);
    try {
      await fetch('/api/mural', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id }),
      });
    } catch {
      /* falha silenciosa de rede */
    }
  };

  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch('/api/mural', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, author: 'Você', text: replyText.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setReplies((prev) => [...prev, data.reply]);
        setReplyText('');
        setShowReplies(true);
      } else if (res.status === 429) {
        alert(data.error || 'Muitas respostas em pouco tempo. Aguarde um instante.');
      }
    } catch {
      /* falha silenciosa de rede */
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-rdt-graphite/50 border border-white/5 rounded-lg p-5">
      <div className="flex items-start gap-3">
        <img
          src={post.avatar}
          alt={post.author}
          className="w-11 h-11 rounded-full object-cover border border-white/10 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-semibold text-sm">{post.author}</span>
            <span className="text-[11px] font-condensed font-bold uppercase tracking-wide bg-rdt-gold/15 text-rdt-gold px-2 py-0.5 rounded">
              {post.team}
            </span>
            <span className="text-white/30 text-xs">{post.date}</span>
          </div>
          <p className="text-white/80 text-sm mt-2 leading-relaxed">{post.text}</p>

          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                liked ? 'text-rdt-gold' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
              {likes}
            </button>
            <button
              onClick={() => setShowReplies((s) => !s)}
              className="flex items-center gap-1.5 text-xs font-medium text-white/40 hover:text-white/70 transition-colors"
            >
              <MessageCircle size={15} />
              {replies.length > 0 ? `${replies.length} resposta${replies.length > 1 ? 's' : ''}` : 'Responder'}
            </button>
          </div>

          {showReplies && (
            <div className="mt-4 flex flex-col gap-3 border-t border-white/5 pt-4">
              {replies.map((r) => (
                <div key={r.id} className="flex items-start gap-2.5">
                  <img
                    src={r.avatar}
                    alt={r.author}
                    className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
                  />
                  <div className="bg-white/5 rounded-lg px-3 py-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs font-semibold">{r.author}</span>
                      <span className="text-white/30 text-[10px]">{r.date}</span>
                    </div>
                    <p className="text-white/70 text-xs mt-1">{r.text}</p>
                  </div>
                </div>
              ))}

              <form onSubmit={submitReply} className="flex items-center gap-2 mt-1">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Escreva uma resposta..."
                  className="flex-1 bg-rdt-black/50 border border-white/10 rounded-full px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rdt-gold"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="p-2 rounded-full bg-rdt-gold text-rdt-black hover:bg-white transition-colors disabled:opacity-50"
                  aria-label="Enviar resposta"
                >
                  {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
