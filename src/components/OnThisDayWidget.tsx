import { Link } from 'react-router-dom';
import { CalendarClock, ArrowRight } from 'lucide-react';
import { onThisDayFacts } from '../data/mockData';

export default function OnThisDayWidget() {
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
  });

  return (
    <div className="bg-gradient-to-b from-rdt-emerald-dark to-rdt-graphite border border-rdt-gold/20 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-1">
        <CalendarClock className="text-rdt-gold" size={20} />
        <h2 className="font-display font-bold text-white text-lg">Neste Dia no Futebol</h2>
      </div>
      <p className="text-white/40 text-xs mb-4 capitalize">{today}</p>

      <div className="flex flex-col gap-4">
        {onThisDayFacts.slice(0, 2).map((fact) => (
          <div key={fact.id} className="border-l-2 border-rdt-gold/50 pl-3">
            <span className="text-rdt-gold font-condensed font-bold text-sm">{fact.year}</span>
            <h3 className="text-white font-semibold text-sm leading-snug mt-0.5">
              {fact.title}
            </h3>
            <p className="text-white/50 text-xs mt-1 line-clamp-2">{fact.description}</p>
          </div>
        ))}
      </div>

      <Link
        to="/neste-dia-no-futebol"
        className="mt-4 w-full flex items-center justify-center gap-2 text-rdt-gold text-sm font-condensed font-semibold uppercase tracking-wide border border-rdt-gold/30 rounded py-2 hover:bg-rdt-gold hover:text-rdt-black transition-colors"
      >
        Ver acervo completo
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
