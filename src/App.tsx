import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
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
import AdminPage from './pages/AdminPage';
import { ArticlesProvider } from './context/ArticlesContext';
import { TickerProvider } from './context/TickerContext';
import { TransfersProvider } from './context/TransfersContext';
import { OnThisDayProvider } from './context/OnThisDayContext';
import { PollProvider } from './context/PollContext';
import { highlightVideos as initialVideos } from './data/mockData';
import type { HighlightVideo } from './types';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

export default function App() {
  const [videos, setVideos] = useState<HighlightVideo[]>(initialVideos);

  const addVideo = (video: HighlightVideo) => {
    setVideos((prev) => [video, ...prev]);
  };

  return (
    <BrowserRouter>
      <ArticlesProvider>
        <TickerProvider>
          <TransfersProvider>
            <OnThisDayProvider>
              <PollProvider>
                <ScrollToTop />
                <div className="min-h-screen bg-rdt-black flex flex-col">
                  <LiveScoreTicker />
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage videos={videos} onAddVideo={addVideo} />} />
                      <Route path="/mercado-da-bola" element={<MercadoPage />} />
                      <Route path="/neste-dia-no-futebol" element={<NesteDiaPage />} />
                      <Route path="/mural-da-torcida" element={<MuralPage />} />
                      <Route path="/colunas" element={<ColunasPage />} />
                      <Route path="/prancheta-tatica" element={<PranchetaPage />} />
                      <Route path="/artigo/:id" element={<ArticlePage />} />
                      <Route path="/admin" element={<AdminPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
                <Analytics />
              </PollProvider>
            </OnThisDayProvider>
          </TransfersProvider>
        </TickerProvider>
      </ArticlesProvider>
    </BrowserRouter>
  );
}
