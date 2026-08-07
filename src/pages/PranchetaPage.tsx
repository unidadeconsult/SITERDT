import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import TacticsBoard from '../components/TacticsBoard';
import { formationKeys } from '../data/formations';
import type { FormationKey } from '../types';

export default function PranchetaPage() {
  const [formation, setFormation] = useState<FormationKey>('4-3-3');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        icon={ClipboardList}
        title="Prancheta Tática"
        subtitle="Monte a escalação do seu time: escolha a formação e clique em cada jogador para personalizar o nome."
      />

      <div className="flex gap-2 mb-6 flex-wrap justify-center">
        {formationKeys.map((key) => (
          <button
            key={key}
            onClick={() => setFormation(key)}
            className={`text-sm font-condensed font-bold uppercase tracking-wide px-4 py-2 rounded-full border transition-colors ${
              formation === key
                ? 'bg-rdt-gold text-rdt-black border-rdt-gold'
                : 'text-white/60 border-white/15 hover:border-rdt-gold/50 hover:text-white'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      <TacticsBoard formation={formation} />

      <p className="text-white/30 text-xs text-center mt-6">
        Clique no nome abaixo de cada jogador para editar a escalação.
      </p>
    </div>
  );
}
