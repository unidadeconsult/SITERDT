import SimpleEntityForm, { type FieldSpec } from './SimpleEntityForm';
import type { LiveMatch } from '../../types';

const fields: FieldSpec[] = [
  { key: 'competition', label: 'Competição' },
  { key: 'time', label: "Status/Hora (ex: Final, 78', 16:30)", half: true },
  { key: 'status', label: 'Status', type: 'select', options: ['FIM', 'AO VIVO', 'HOJE'], half: true },
  { key: 'homeTeam', label: 'Time da casa', half: true },
  { key: 'homeAbbr', label: 'Sigla da casa (3 letras)', half: true },
  { key: 'awayTeam', label: 'Time visitante', half: true },
  { key: 'awayAbbr', label: 'Sigla do visitante (3 letras)', half: true },
  { key: 'homeScore', label: 'Gols da casa', type: 'number', half: true },
  { key: 'awayScore', label: 'Gols do visitante', type: 'number', half: true },
];

export default function TickerForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: LiveMatch;
  submitLabel: string;
  onSubmit: (fields: Record<string, string>) => Promise<void>;
}) {
  return (
    <SimpleEntityForm fields={fields} initial={initial} submitLabel={submitLabel} onSubmit={onSubmit} />
  );
}
