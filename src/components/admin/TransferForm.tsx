import SimpleEntityForm, { type FieldSpec } from './SimpleEntityForm';
import type { Transfer } from '../../types';

const fields: FieldSpec[] = [
  { key: 'player', label: 'Jogador' },
  { key: 'fromClub', label: 'Clube de origem', half: true },
  { key: 'toClub', label: 'Clube de destino', half: true },
  { key: 'status', label: 'Status', type: 'select', options: ['Rumor', 'Esquentou', 'Confirmado'], half: true },
  { key: 'probability', label: 'Probabilidade (%)', type: 'number', half: true },
  { key: 'year', label: 'Ano', type: 'number', half: true },
  { key: 'country', label: 'País', half: true },
  { key: 'detail', label: 'Detalhe', type: 'textarea' },
];

export default function TransferForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Transfer;
  submitLabel: string;
  onSubmit: (fields: Record<string, string>) => Promise<void>;
}) {
  return (
    <SimpleEntityForm fields={fields} initial={initial} submitLabel={submitLabel} onSubmit={onSubmit} />
  );
}
