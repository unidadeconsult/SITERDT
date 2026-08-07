import { useState, useMemo } from 'react';
import type { Article, Category } from '../types';
import ArticleCard from './ArticleCard';

export default function NewsGrid({ articles }: { articles: Article[] }) {
  const [filter, setFilter] = useState<Category | 'Todos'>('Todos');

  const categories = useMemo(
    () => ['Todos', ...Array.from(new Set(articles.map((a) => a.category)))] as (
      | Category
      | 'Todos'
    )[],
    [articles]
  );

  const filtered = filter === 'Todos' ? articles : articles.filter((a) => a.category === filter);

  return (
    <section>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="font-display font-bold text-white text-xl sm:text-2xl">
          Últimas Notícias
        </h2>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-xs font-condensed font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full border transition-colors ${
                filter === cat
                  ? 'bg-rdt-gold text-rdt-black border-rdt-gold'
                  : 'text-white/60 border-white/15 hover:border-rdt-gold/50 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-white/40 text-sm py-10 text-center">
          Nenhuma notícia encontrada nesta categoria.
        </p>
      )}
    </section>
  );
}
