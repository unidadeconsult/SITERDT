import { useState, useEffect } from 'react';
import type { FormationKey } from '../types';
import { formations } from '../data/formations';

const positionNames: Record<string, string> = {
  GOL: 'Goleiro',
  LE: 'Lateral E.',
  LD: 'Lateral D.',
  ZAG: 'Zagueiro',
  VOL: 'Volante',
  MC: 'Meia',
  ME: 'Meia E.',
  MD: 'Meia D.',
  MEA: 'Meia Ofensivo',
  PE: 'Ponta E.',
  PD: 'Ponta D.',
  CA: 'Centroavante',
  ATA: 'Atacante',
};

export default function TacticsBoard({ formation }: { formation: FormationKey }) {
  const positions = formations[formation];
  const [names, setNames] = useState<string[]>(
    positions.map((pos) => positionNames[pos.label] ?? pos.label)
  );
  const [editing, setEditing] = useState<number | null>(null);

  useEffect(() => {
    setNames(positions.map((pos) => positionNames[pos.label] ?? pos.label));
    setEditing(null);
  }, [formation, positions]);

  return (
    <div className="relative w-full aspect-[3/4] max-w-xl mx-auto rounded-lg overflow-hidden border-2 border-white/20 bg-gradient-to-b from-emerald-800 to-emerald-900">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 h-px bg-white/10"
          style={{ top: `${(i + 1) * (100 / 7)}%` }}
        />
      ))}

      <div className="absolute left-0 right-0 top-1/2 h-px bg-white/30" />
      <div className="absolute left-1/2 top-1/2 w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/30" />
      <div className="absolute left-1/2 top-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40" />

      <div className="absolute left-1/2 top-0 w-[46%] h-[16%] -translate-x-1/2 border-2 border-t-0 border-white/30" />
      <div className="absolute left-1/2 bottom-0 w-[46%] h-[16%] -translate-x-1/2 border-2 border-b-0 border-white/30" />
      <div className="absolute left-1/2 top-0 w-[22%] h-[7%] -translate-x-1/2 border-2 border-t-0 border-white/30" />
      <div className="absolute left-1/2 bottom-0 w-[22%] h-[7%] -translate-x-1/2 border-2 border-b-0 border-white/30" />

      {positions.map((pos, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out flex flex-col items-center gap-1 group"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-rdt-gold text-rdt-black flex items-center justify-center font-condensed font-bold text-[11px] sm:text-xs shadow-md border-2 border-white/70 group-hover:scale-110 transition-transform">
            {pos.label}
          </div>
          {editing === i ? (
            <input
              autoFocus
              value={names[i] ?? ''}
              onChange={(e) =>
                setNames((prev) => prev.map((n, idx) => (idx === i ? e.target.value : n)))
              }
              onBlur={() => setEditing(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditing(null)}
              className="w-20 text-center bg-rdt-black/80 text-white text-[10px] rounded px-1 py-0.5 border border-rdt-gold focus:outline-none"
            />
          ) : (
            <button
              onClick={() => setEditing(i)}
              className="text-[10px] sm:text-[11px] text-white bg-black/50 px-1.5 py-0.5 rounded whitespace-nowrap max-w-[80px] truncate hover:bg-black/70 transition-colors"
            >
              {names[i] || 'Jogador'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
