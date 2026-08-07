import { useState } from 'react';
import { X, Link2, PlusCircle } from 'lucide-react';
import { extractYouTubeId } from '../utils/youtube';
import type { HighlightVideo } from '../types';

interface AddVideoModalProps {
  onClose: () => void;
  onAdd: (video: HighlightVideo) => void;
}

export default function AddVideoModal({ onClose, onAdd }: AddVideoModalProps) {
  const [input, setInput] = useState('');
  const [title, setTitle] = useState('');
  const [competition, setCompetition] = useState('');
  const [error, setError] = useState('');

  const videoId = extractYouTubeId(input);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoId) {
      setError('Cole uma URL do YouTube ou um ID de vídeo válido.');
      return;
    }
    onAdd({
      id: `v-${Date.now()}`,
      videoId,
      title: title.trim() || 'Melhores momentos',
      competition: competition.trim() || 'RDT Futebol',
      duration: '--:--',
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-rdt-graphite border border-rdt-gold/30 rounded-lg w-full max-w-md p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        <h2 className="font-display font-bold text-white text-xl mb-1 flex items-center gap-2">
          <PlusCircle className="text-rdt-gold" size={22} />
          Publicar melhores momentos
        </h2>
        <p className="text-white/50 text-sm mb-5">
          Cole o link (ou ID) de um vídeo do YouTube para adicioná-lo à lista de reprodução.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-condensed uppercase tracking-wide text-white/50 mb-1 flex items-center gap-1">
              <Link2 size={12} />
              URL ou ID do YouTube
            </label>
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError('');
              }}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-rdt-black/60 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-rdt-gold"
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="text-xs font-condensed uppercase tracking-wide text-white/50 mb-1 block">
              Título (opcional)
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Melhores momentos da partida"
              className="w-full bg-rdt-black/60 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-rdt-gold"
            />
          </div>

          <div>
            <label className="text-xs font-condensed uppercase tracking-wide text-white/50 mb-1 block">
              Competição (opcional)
            </label>
            <input
              value={competition}
              onChange={(e) => setCompetition(e.target.value)}
              placeholder="Brasileirão, Libertadores..."
              className="w-full bg-rdt-black/60 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-rdt-gold"
            />
          </div>

          {videoId && (
            <div className="aspect-video rounded overflow-hidden border border-white/10">
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt="Prévia do vídeo"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <button
            type="submit"
            className="mt-2 bg-rdt-gold text-rdt-black font-condensed font-bold uppercase tracking-wide text-sm py-2.5 rounded hover:bg-white transition-colors"
          >
            Publicar vídeo
          </button>
        </form>
      </div>
    </div>
  );
}
