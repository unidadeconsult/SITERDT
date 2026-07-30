import ResourceAdmin from './ResourceAdmin';
import TickerForm from './TickerForm';
import type { LiveMatch } from '../../types';

export default function TickerAdminTab({ onAuthError }: { onAuthError?: () => void }) {
  return (
    <ResourceAdmin<LiveMatch>
      resourceUrl="/api/ticker"
      itemLabel="Jogo"
      FormComponent={TickerForm}
      onAuthError={onAuthError}
      renderItem={(m) => ({
        title: `${m.homeAbbr} ${m.homeScore} x ${m.awayScore} ${m.awayAbbr}`,
        subtitle: `${m.competition} · ${m.status} · ${m.time}`,
      })}
    />
  );
}
