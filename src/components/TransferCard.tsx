import { ArrowRightLeft, Calendar, MapPin } from 'lucide-react';
import type { Transfer } from '../types';
import TransferStatusBadge from './TransferStatusBadge';

const barColor = (status: Transfer['status']) => {
  if (status === 'Confirmado') return 'bg-emerald-500';
  if (status === 'Esquentou') return 'bg-orange-400';
  return 'bg-white/30';
};

export default function TransferCard({ transfer }: { transfer: Transfer }) {
  return (
    <div className="bg-rdt-graphite/60 border border-white/5 rounded-lg p-4 hover:border-rdt-gold/30 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-white font-semibold text-base">{transfer.player}</h3>
        <TransferStatusBadge status={transfer.status} />
      </div>
      <div className="flex items-center gap-2 text-sm text-white/50 mt-1.5">
        <span>{transfer.fromClub}</span>
        <ArrowRightLeft size={14} className="text-rdt-gold shrink-0" />
        <span className="text-white/80 font-medium">{transfer.toClub}</span>
      </div>
      <p className="text-white/40 text-xs mt-2 leading-relaxed">{transfer.detail}</p>
      <div className="flex items-center gap-3 mt-2.5 text-[11px] text-white/40">
        <span className="flex items-center gap-1">
          <Calendar size={11} />
          {transfer.year}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={11} />
          {transfer.country}
        </span>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-white/40 mb-1">
          <span>Probabilidade</span>
          <span className="font-semibold text-white/70">{transfer.probability}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${barColor(transfer.status)}`}
            style={{ width: `${transfer.probability}%` }}
          />
        </div>
      </div>
    </div>
  );
}
