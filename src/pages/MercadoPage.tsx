import { useState } from 'react';
import { Repeat } from 'lucide-react';
import { transfers } from '../data/mockData';
import type { TransferStatus } from '../types';
import TransferCard from '../components/TransferCard';
import PageHeader from '../components/PageHeader';

const filters: (TransferStatus | 'Todos')[] = ['Todos', 'Rumor', 'Esquentou', 'Confirmado'];

export default function MercadoPage() {
  const [filter, setFilter] = useState<TransferStatus | 'Todos'>('Todos');

  const filtered =
    filter === 'Todos' ? transfers : transfers.filter((t) => t.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        icon={Repeat}
        title="Mercado da Bola"
        subtitle="Acompanhe o transferômetro RDT: rumores, negociações esquentando e contratações confirmadas do futebol brasileiro e internacional."
      />

      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-condensed font-semibold uppercase tracking-wide px-3.5 py-2 rounded-full border transition-colors ${
              filter === f
                ? 'bg-rdt-gold text-rdt-black border-rdt-gold'
                : 'text-white/60 border-white/15 hover:border-rdt-gold/50 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((t) => (
          <TransferCard key={t.id} transfer={t} />
        ))}
      </div>
    </div>
  );
}
