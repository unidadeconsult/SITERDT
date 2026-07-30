import ResourceAdmin from './ResourceAdmin';
import TransferForm from './TransferForm';
import type { Transfer } from '../../types';

export default function MercadoAdminTab({ onAuthError }: { onAuthError?: () => void }) {
  return (
    <ResourceAdmin<Transfer>
      resourceUrl="/api/transfers"
      itemLabel="Transferência"
      FormComponent={TransferForm}
      onAuthError={onAuthError}
      renderItem={(t) => ({
        title: `${t.player} — ${t.fromClub} → ${t.toClub}`,
        subtitle: `${t.status} · ${t.year} · ${t.country}`,
      })}
    />
  );
}
