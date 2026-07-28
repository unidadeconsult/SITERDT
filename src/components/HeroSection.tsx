import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import type { Article } from '../types';
import CategoryTag from './CategoryTag';

export default function HeroSection({ article }: { article: Article }) {
  return (
    <Link
      to={`/artigo/${article.id}`}
      className="relative rounded-lg overflow-hidden cursor-pointer group h-[420px] sm:h-[480px] lg:h-[560px] block"
    >
      <img
        src={article.image}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-rdt-black via-rdt-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-rdt-emerald-dark/40 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-12">
        <CategoryTag category={article.category} className="mb-4" />
        <h1 className="font-display font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-shadow-heavy max-w-3xl group-hover:text-rdt-gold transition-colors">
          {article.title}
        </h1>
        <p className="text-white/80 mt-4 max-w-2xl text-sm sm:text-base leading-relaxed hidden sm:block">
          {article.dek}
        </p>
        <div className="flex items-center gap-4 mt-5 text-white/60 text-sm">
          <span className="text-white font-medium">{article.author}</span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span>{article.date}</span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {article.readTime} min de leitura
          </span>
        </div>
      </div>
    </Link>
  );
}
