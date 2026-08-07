import { PenSquare } from 'lucide-react';
import { useArticles } from '../context/ArticlesContext';
import PageHeader from '../components/PageHeader';
import ArticleCard from '../components/ArticleCard';

export default function ColunasPage() {
  const { articles } = useArticles();
  const authors = Array.from(new Set(articles.map((a) => a.author)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        icon={PenSquare}
        title="Colunas"
        subtitle="Crônicas, análises e o olhar autoral dos colunistas RDT sobre o futebol brasileiro e internacional."
      />

      <div className="flex flex-col gap-12">
        {authors.map((author) => {
          const authorArticles = articles.filter((a) => a.author === author);
          return (
            <div key={author}>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={authorArticles[0].authorAvatar}
                  alt={author}
                  className="w-11 h-11 rounded-full border-2 border-rdt-gold/50 object-cover"
                />
                <div>
                  <h2 className="font-display font-bold text-white text-lg">{author}</h2>
                  <p className="text-white/40 text-xs">
                    {authorArticles.length} publicação
                    {authorArticles.length > 1 ? 'ões' : ''}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {authorArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
