import SimpleEntityForm, { type FieldSpec } from './SimpleEntityForm';
import type { OnThisDayFact } from '../../types';

const fields: FieldSpec[] = [
  { key: 'year', label: 'Ano', type: 'number', half: true },
  { key: 'title', label: 'Título', half: true },
  { key: 'description', label: 'Descrição', type: 'textarea' },
];

export default function OnThisDayForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: OnThisDayFact;
  submitLabel: string;
  onSubmit: (fields: Record<string, string>) => Promise<void>;
}) {
  return (
    <SimpleEntityForm fields={fields} initial={initial} submitLabel={submitLabel} onSubmit={onSubmit} />
  );
}
