import HeroSection from '../components/HeroSection';
import NewsGrid from '../components/NewsGrid';
import VideoHighlights from '../components/VideoHighlights';
import OnThisDayWidget from '../components/OnThisDayWidget';
import TransferMarketWidget from '../components/TransferMarketWidget';
import PollWidget from '../components/PollWidget';
import { articles } from '../data/mockData';
import type { View } from '../navigation';
import type { HighlightVideo } from '../types';
import { MessagesSquare, ClipboardList, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onOpenArticle: (id: string) => void;
  onNavigate: (view: View) => void;
  videos: HighlightVideo[];
  onAddVideo: (video: HighlightVideo) => void;
}

export default function HomePage({
  onOpenArticle,
  onNavigate,
  videos,
  onAddVideo,
}: HomePageProps) {
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.id !== featured.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-12">
      <HeroSection article={featured} onOpen={onOpenArticle} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        <div className="flex flex-col gap-12">
          <NewsGrid articles={rest} onOpen={onOpenArticle} />
          <VideoHighlights videos={videos} onAddVideo={onAddVideo} />
        </div>

        <aside className="flex flex-col gap-6">
          <OnThisDayWidget onNavigate={onNavigate} />
          <TransferMarketWidget onNavigate={onNavigate} />
          <PollWidget />

          <div className="bg-rdt-graphite/40 border border-white/5 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <MessagesSquare className="text-rdt-gold" size={20} />
              <h2 className="font-display font-bold text-white text-lg">Mural da Torcida</h2>
            </div>
            <p className="text-white/50 text-sm mb-4">
              Compartilhe sua opinião e veja o que a torcida está falando sobre seu time do
              coração.
            </p>
            <button
              onClick={() => onNavigate('mural')}
              className="w-full flex items-center justify-center gap-2 text-rdt-gold text-sm font-condensed font-semibold uppercase tracking-wide border border-rdt-gold/30 rounded py-2 hover:bg-rdt-gold hover:text-rdt-black transition-colors"
            >
              Ir para o mural
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="bg-gradient-to-b from-rdt-emerald-dark to-rdt-graphite border border-rdt-gold/20 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="text-rdt-gold" size={20} />
              <h2 className="font-display font-bold text-white text-lg">Prancheta Tática</h2>
            </div>
            <p className="text-white/50 text-sm mb-4">
              Monte a escalação ideal do seu time com nosso visualizador de campo interativo.
            </p>
            <button
              onClick={() => onNavigate('prancheta')}
              className="w-full flex items-center justify-center gap-2 text-rdt-gold text-sm font-condensed font-semibold uppercase tracking-wide border border-rdt-gold/30 rounded py-2 hover:bg-rdt-gold hover:text-rdt-black transition-colors"
            >
              Montar escalação
              <ArrowRight size={16} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
