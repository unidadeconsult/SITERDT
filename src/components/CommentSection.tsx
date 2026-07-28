import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import type { Comment } from '../types';
import CommentItem from './CommentItem';

export default function CommentSection({ initialComments }: { initialComments: Comment[] }) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setComments((prev) => [
      {
        id: `comment-${Date.now()}`,
        author: 'Você',
        avatar: 'https://i.pravatar.cc/150?img=68',
        date: 'agora mesmo',
        text: text.trim(),
        likes: 0,
        replies: [],
      },
      ...prev,
    ]);
    setText('');
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
            className="p-2.5 rounded-lg bg-rdt-gold text-rdt-black hover:bg-white transition-colors shrink-0"
            aria-label="Enviar comentário"
          >
            <Send size={16} />
          </button>
        </div>
      </form>

      <div className="flex flex-col divide-y divide-white/5">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} />
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
