import { useState } from 'react';
import { PlayCircle, Clock3, PlusCircle } from 'lucide-react';
import type { HighlightVideo } from '../types';
import AddVideoModal from './AddVideoModal';

interface VideoHighlightsProps {
  videos: HighlightVideo[];
  onAddVideo: (video: HighlightVideo) => void;
}

export default function VideoHighlights({ videos, onAddVideo }: VideoHighlightsProps) {
  const [active, setActive] = useState<HighlightVideo>(videos[0]);
  const [modalOpen, setModalOpen] = useState(false);

  const current = videos.find((v) => v.id === active.id) ?? videos[0];

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PlayCircle className="text-rdt-gold" size={22} />
          <h2 className="font-display font-bold text-white text-xl sm:text-2xl">
            Resumo em Vídeo
          </h2>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 text-sm font-condensed font-semibold uppercase tracking-wide text-rdt-black bg-rdt-gold px-3 py-2 rounded hover:bg-white transition-colors"
        >
          <PlusCircle size={16} />
          <span className="hidden sm:inline">Publicar vídeo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-black rounded-lg overflow-hidden border border-white/5">
          <div className="aspect-video">
            <iframe
              key={current.videoId}
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${current.videoId}`}
              title={current.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-4">
            <span className="text-rdt-gold text-xs font-condensed font-bold uppercase tracking-wide">
              {current.competition}
            </span>
            <h3 className="text-white font-semibold text-lg mt-1">{current.title}</h3>
          </div>
        </div>

        <div className="flex flex-col gap-2 max-h-[420px] lg:max-h-none overflow-y-auto pr-1">
          {videos.map((v) => (
            <button
              key={v.id}
              onClick={() => setActive(v)}
              className={`flex gap-3 items-center text-left p-2 rounded-lg border transition-colors ${
                v.id === current.id
                  ? 'bg-rdt-gold/10 border-rdt-gold/40'
                  : 'bg-rdt-graphite/50 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="relative w-28 aspect-video rounded overflow-hidden shrink-0">
                <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded flex items-center gap-0.5">
                  <Clock3 size={9} />
                  {v.duration}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium line-clamp-2 leading-snug">
                  {v.title}
                </p>
                <p className="text-white/40 text-xs mt-1">{v.competition}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {modalOpen && (
        <AddVideoModal
          onClose={() => setModalOpen(false)}
          onAdd={(video) => {
            onAddVideo(video);
            setActive(video);
          }}
        />
      )}
    </section>
  );
}
