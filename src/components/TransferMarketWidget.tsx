import { Repeat, ArrowRight } from 'lucide-react';
import { transfers } from '../data/mockData';
import type { View } from '../navigation';
import TransferCard from './TransferCard';

export default function TransferMarketWidget({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="bg-rdt-graphite/40 border border-white/5 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <Repeat className="text-rdt-gold" size={20} />
        <h2 className="font-display font-bold text-white text-lg">Mercado da Bola</h2>
      </div>

      <div className="flex flex-col gap-3">
        {transfers.slice(0, 3).map((t) => (
          <TransferCard key={t.id} transfer={t} />
        ))}
      </div>

      <button
        onClick={() => onNavigate('mercado')}
        className="mt-4 w-full flex items-center justify-center gap-2 text-rdt-gold text-sm font-condensed font-semibold uppercase tracking-wide border border-rdt-gold/30 rounded py-2 hover:bg-rdt-gold hover:text-rdt-black transition-colors"
      >
        Ver transferômetro completo
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
