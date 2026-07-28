import { CalendarClock } from 'lucide-react';
import { onThisDayFacts } from '../data/mockData';
import PageHeader from '../components/PageHeader';

export default function NesteDiaPage() {
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        icon={CalendarClock}
        title="Neste Dia no Futebol"
        subtitle={`Acervo de crônicas, jogos inesquecíveis e fatos marcantes que aconteceram em ${today} ao longo da história do futebol.`}
      />

      <div className="relative pl-8 flex flex-col gap-8 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-rdt-gold/20">
        {onThisDayFacts.map((fact) => (
          <div key={fact.id} className="relative">
            <span className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full bg-rdt-gold border-4 border-rdt-black" />
            <div className="bg-rdt-graphite/50 border border-white/5 rounded-lg p-5 hover:border-rdt-gold/30 transition-colors">
              <span className="text-rdt-gold font-condensed font-bold text-lg">{fact.year}</span>
              <h2 className="text-white font-display font-bold text-xl mt-1">{fact.title}</h2>
              <p className="text-white/60 text-sm mt-2 leading-relaxed">{fact.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
