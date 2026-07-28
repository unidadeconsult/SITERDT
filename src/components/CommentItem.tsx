import { useState } from 'react';
import { Heart, Reply, Send } from 'lucide-react';
import type { Comment } from '../types';

export default function CommentItem({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [likes, setLikes] = useState(comment.likes);
  const [liked, setLiked] = useState(false);
  const [replies, setReplies] = useState<Comment[]>(comment.replies);
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState('');

  const toggleLike = () => {
    setLiked((p) => !p);
    setLikes((p) => (liked ? p - 1 : p + 1));
  };

  const submitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setReplies((prev) => [
      ...prev,
      {
        id: `reply-${Date.now()}`,
        author: 'Você',
        avatar: 'https://i.pravatar.cc/150?img=68',
        date: 'agora mesmo',
        text: text.trim(),
        likes: 0,
        replies: [],
      },
    ]);
    setText('');
    setShowForm(false);
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
                className="p-1.5 rounded-full bg-rdt-gold text-rdt-black hover:bg-white transition-colors"
                aria-label="Enviar resposta"
              >
                <Send size={13} />
              </button>
            </form>
          )}

          {replies.length > 0 && (
            <div className="mt-1">
              {replies.map((r) => (
                <CommentItem key={r.id} comment={r} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
