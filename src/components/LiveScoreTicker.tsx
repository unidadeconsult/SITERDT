import { Radio } from 'lucide-react';
import { useTicker } from '../context/TickerContext';
import type { LiveMatch } from '../types';

function MatchPill({ match }: { match: LiveMatch }) {
  const isLive = match.status === 'AO VIVO';
  return (
    <div className="flex items-center gap-3 px-5 py-2 border-r border-white/10 whitespace-nowrap shrink-0">
      <span className="text-[10px] font-condensed tracking-wider text-rdt-gold/80 uppercase">
        {match.competition}
      </span>
      <span
        className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
          isLive
            ? 'bg-red-600 text-white'
            : match.status === 'HOJE'
            ? 'bg-rdt-gold text-rdt-black'
            : 'bg-white/10 text-white/70'
        }`}
      >
        {isLive && <Radio size={10} className="animate-pulse-live" />}
        {match.status}
      </span>
      <span className="text-sm font-semibold text-white">
        {match.homeAbbr} <span className="text-rdt-gold">{match.homeScore}</span>
        <span className="text-white/40 mx-1">x</span>
        <span className="text-rdt-gold">{match.awayScore}</span> {match.awayAbbr}
      </span>
      <span className="text-xs text-white/50">{match.time}</span>
    </div>
  );
}

export default function LiveScoreTicker() {
  const { items: matches } = useTicker();
  if (matches.length === 0) return null;
  const doubled = [...matches, ...matches];
  return (
    <div className="bg-rdt-black border-b border-rdt-gold/20 overflow-hidden">
      <div className="flex animate-ticker w-max">
        {doubled.map((m, i) => (
          <MatchPill key={`${m.id}-${i}`} match={m} />
        ))}
      </div>
    </div>
  );
}
