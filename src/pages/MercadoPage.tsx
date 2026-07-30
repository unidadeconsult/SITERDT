import { useMemo, useState } from 'react';
import { Repeat } from 'lucide-react';
import { useTransfers } from '../context/TransfersContext';
import TransferCard from '../components/TransferCard';
import PageHeader from '../components/PageHeader';

export default function MercadoPage() {
  const { items: transfers } = useTransfers();
  const [filter, setFilter] = useState<string>('Todos');

  const filters = useMemo(
    () => ['Todos', ...Array.from(new Set(transfers.map((t) => t.country)))],
    [transfers]
  );

  const filtered =
    filter === 'Todos' ? transfers : transfers.filter((t) => t.country === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        icon={Repeat}
        title="Mercado da Bola"
        subtitle="Transferências históricas da América do Sul: relembre as contratações internacionais que marcaram o futebol sul-americano."
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
