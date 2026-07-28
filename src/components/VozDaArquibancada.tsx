import { useEffect, useState } from 'react';
import { Megaphone, Heart, Star, MessageCircle, ExternalLink } from 'lucide-react';
import type { CommunityPost } from '../types';

export default function VozDaArquibancada() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;

    fetch('/api/community-posts?limit=12')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setPosts(Array.isArray(data?.items) ? data.items : []);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'ready' && posts.length === 0) return null;
  if (status === 'error') return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Megaphone className="text-rdt-gold" size={22} />
        <h2 className="font-display font-bold text-white text-xl sm:text-2xl">
          Voz da Arquibancada
        </h2>
        <span className="text-white/40 text-xs font-condensed uppercase tracking-wide">
          direto da Comunidade RDT
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
        {status === 'loading' &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-72 h-40 rounded-lg bg-rdt-graphite/40 border border-white/5 animate-pulse"
            />
          ))}

        {status === 'ready' &&
          posts.map((post) => (
            <a
              key={post.id}
              href={post.communityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group shrink-0 w-72 bg-rdt-graphite/60 border border-white/5 rounded-lg p-4 flex flex-col hover:border-rdt-gold/40 transition-colors"
            >
              {post.image && (
                <img
                  src={post.image.url}
                  alt={post.image.alt}
                  className="w-full h-28 object-cover rounded mb-3"
                />
              )}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-condensed font-bold uppercase tracking-wide bg-rdt-gold/15 text-rdt-gold px-2 py-0.5 rounded">
                  {post.category}
                </span>
                {post.author.badge && (
                  <span className="text-[10px] font-condensed font-semibold uppercase tracking-wide bg-white/10 text-white/60 px-2 py-0.5 rounded">
                    {post.author.badge}
                  </span>
                )}
              </div>
              <p className="text-white/85 text-sm leading-snug line-clamp-3 flex-1">
                {post.text}
              </p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <span className="text-white/50 text-xs truncate">{post.author.name}</span>
                <div className="flex items-center gap-2.5 text-white/40 text-[11px] shrink-0">
                  <span className="flex items-center gap-1">
                    <Heart size={11} />
                    {post.metrics.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={11} />
                    {post.metrics.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={11} />
                    {post.metrics.comments}
                  </span>
                  <ExternalLink size={11} className="group-hover:text-rdt-gold transition-colors" />
                </div>
              </div>
            </a>
          ))}
      </div>
    </section>
  );
}
