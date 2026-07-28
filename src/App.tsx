import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveScoreTicker from './components/LiveScoreTicker';
import HomePage from './pages/HomePage';
import MercadoPage from './pages/MercadoPage';
import NesteDiaPage from './pages/NesteDiaPage';
import MuralPage from './pages/MuralPage';
import ColunasPage from './pages/ColunasPage';
import PranchetaPage from './pages/PranchetaPage';
import ArticlePage from './pages/ArticlePage';
import type { View } from './navigation';
import { liveMatches, highlightVideos as initialVideos } from './data/mockData';
import type { HighlightVideo } from './types';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [articleId, setArticleId] = useState<string | null>(null);
  const [videos, setVideos] = useState<HighlightVideo[]>(initialVideos);

  const navigate = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openArticle = (id: string) => {
    setArticleId(id);
    setView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addVideo = (video: HighlightVideo) => {
    setVideos((prev) => [video, ...prev]);
  };

  let content;
  switch (view) {
    case 'mercado':
      content = <MercadoPage />;
      break;
    case 'nestedia':
      content = <NesteDiaPage />;
      break;
    case 'mural':
      content = <MuralPage />;
      break;
    case 'colunas':
      content = <ColunasPage onOpenArticle={openArticle} />;
      break;
    case 'prancheta':
      content = <PranchetaPage />;
      break;
    case 'article':
      content = (
        <ArticlePage
          articleId={articleId}
          onOpenArticle={openArticle}
          onBack={() => navigate('home')}
        />
      );
      break;
    default:
      content = (
        <HomePage
          onOpenArticle={openArticle}
          onNavigate={navigate}
          videos={videos}
          onAddVideo={addVideo}
        />
      );
  }

  return (
    <div className="min-h-screen bg-rdt-black flex flex-col">
      <LiveScoreTicker matches={liveMatches} />
      <Navbar current={view} onNavigate={navigate} />
      <main className="flex-1">{content}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
}
