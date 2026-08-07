import type { TransferStatus } from '../types';

const styles: Record<TransferStatus, string> = {
  Rumor: 'bg-white/10 text-white/70',
  Esquentou: 'bg-orange-500/20 text-orange-400',
  Confirmado: 'bg-emerald-500/20 text-emerald-400',
};

export default function TransferStatusBadge({ status }: { status: TransferStatus }) {
  return (
    <span
      className={`text-[11px] font-condensed font-bold uppercase tracking-wide px-2 py-1 rounded ${styles[status]}`}
    >
      {status}
    </span>
  );
}
