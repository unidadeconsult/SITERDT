import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import type { Article } from '../types';
import CategoryTag from './CategoryTag';

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to={`/artigo/${article.id}`}
      className="group cursor-pointer bg-rdt-graphite/60 border border-white/5 rounded-lg overflow-hidden hover:border-rdt-gold/40 transition-colors flex flex-col"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <CategoryTag category={article.category} className="absolute top-3 left-3" />
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-display font-bold text-white text-lg leading-snug line-clamp-2 group-hover:text-rdt-gold transition-colors">
          {article.title}
        </h3>
        <p className="text-white/50 text-sm line-clamp-2">{article.dek}</p>
        <div className="mt-auto pt-2 flex items-center justify-between text-xs text-white/40">
          <span>{article.author}</span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {article.readTime} min
          </span>
        </div>
      </div>
    </Link>
  );
}
