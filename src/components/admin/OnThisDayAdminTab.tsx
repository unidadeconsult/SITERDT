import ResourceAdmin from './ResourceAdmin';
import OnThisDayForm from './OnThisDayForm';
import type { OnThisDayFact } from '../../types';

export default function OnThisDayAdminTab({ onAuthError }: { onAuthError?: () => void }) {
  return (
    <ResourceAdmin<OnThisDayFact>
      resourceUrl="/api/onthisday"
      itemLabel="Fato"
      FormComponent={OnThisDayForm}
      onAuthError={onAuthError}
      renderItem={(f) => ({
        title: f.title,
        subtitle: `${f.year} · ${f.description}`,
      })}
    />
  );
}
