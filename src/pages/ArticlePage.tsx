import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { useArticles } from '../context/ArticlesContext';
import CategoryTag from '../components/CategoryTag';
import CommentSection from '../components/CommentSection';
import ArticleCard from '../components/ArticleCard';
import ShareToCommunity from '../components/ShareToCommunity';

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articles } = useArticles();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-white/60">Matéria não encontrada.</p>
        <Link to="/" className="mt-4 inline-block text-rdt-gold underline underline-offset-4">
          Voltar para o início
        </Link>
      </div>
    );
  }

  const related = articles.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);
  const relatedFallback = related.length > 0 ? related : articles.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <article className="pb-16">
      <div className="relative h-[320px] sm:h-[420px] lg:h-[480px]">
        <img src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-rdt-black via-rdt-black/70 to-black/20" />
        <div className="absolute inset-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-white/70 hover:text-rdt-gold text-sm mb-4 w-fit transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          <CategoryTag category={article.category} className="mb-4 w-fit" />
          <h1 className="font-display font-extrabold text-white text-2xl sm:text-4xl leading-tight text-shadow-heavy max-w-3xl">
            {article.title}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-white/10 flex-wrap">
          <div className="flex items-center gap-4">
            <img
              src={article.authorAvatar}
              alt={article.author}
              className="w-12 h-12 rounded-full object-cover border-2 border-rdt-gold/50"
            />
            <div>
              <p className="text-white font-semibold text-sm">{article.author}</p>
              <div className="flex items-center gap-3 text-white/40 text-xs mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {article.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {article.readTime} min de leitura
                </span>
              </div>
            </div>
          </div>
          <ShareToCommunity article={article} />
        </div>

        <div className="mt-6 flex flex-col gap-5">
          <p className="text-white/90 text-lg leading-relaxed font-medium">{article.dek}</p>
          {article.body.map((paragraph, i) => (
            <p key={i} className="text-white/70 text-base leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <CommentSection articleId={article.id} initialComments={article.comments} />

        {relatedFallback.length > 0 && (
          <div className="mt-14 pt-8 border-t border-white/10">
            <h2 className="font-display font-bold text-white text-xl mb-4">Leia também</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedFallback.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
