import { useState } from 'react';
import { ShieldCheck, Lock, Newspaper, Radio, Repeat, CalendarClock, Vote } from 'lucide-react';
import { getStoredAdminPassword, setStoredAdminPassword, clearStoredAdminPassword } from '../lib/adminAuth';
import PageHeader from '../components/PageHeader';
import MateriasAdminTab from '../components/admin/MateriasAdminTab';
import TickerAdminTab from '../components/admin/TickerAdminTab';
import MercadoAdminTab from '../components/admin/MercadoAdminTab';
import OnThisDayAdminTab from '../components/admin/OnThisDayAdminTab';
import PollAdminTab from '../components/admin/PollAdminTab';

type Section = 'materias' | 'ticker' | 'mercado' | 'nestedia' | 'enquete';

const sections: { key: Section; label: string; icon: typeof Newspaper }[] = [
  { key: 'materias', label: 'Matérias', icon: Newspaper },
  { key: 'ticker', label: 'Ticker de Placares', icon: Radio },
  { key: 'mercado', label: 'Mercado da Bola', icon: Repeat },
  { key: 'nestedia', label: 'Neste Dia no Futebol', icon: CalendarClock },
  { key: 'enquete', label: 'Enquete do Dia', icon: Vote },
];

export default function AdminPage() {
  const [password, setPassword] = useState(getStoredAdminPassword());
  const [unlocked, setUnlocked] = useState(!!getStoredAdminPassword());
  const [authError, setAuthError] = useState('');
  const [section, setSection] = useState<Section>('materias');

  const unlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setStoredAdminPassword(password);
    setUnlocked(true);
    setAuthError('');
  };

  const lock = () => {
    clearStoredAdminPassword();
    setPassword('');
    setUnlocked(false);
  };

  const handleAuthError = () => {
    clearStoredAdminPassword();
    setUnlocked(false);
    setAuthError('Senha de administrador incorreta.');
  };

  if (!unlocked) {
    return (
      <div className="max-w-sm mx-auto px-4 py-24">
        <div className="text-center mb-6">
          <Lock className="text-rdt-gold mx-auto mb-3" size={32} />
          <h1 className="font-display font-bold text-white text-2xl">Área do Administrador</h1>
        </div>
        <form onSubmit={unlock} className="flex flex-col gap-3">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha de administrador"
            className="w-full bg-rdt-graphite/60 border border-white/10 rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rdt-gold"
          />
          {authError && <p className="text-red-400 text-sm text-center">{authError}</p>}
          <button
            type="submit"
            className="bg-rdt-gold text-rdt-black font-condensed font-bold uppercase tracking-wide text-sm py-2.5 rounded hover:bg-white transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <PageHeader
          icon={ShieldCheck}
          title="Painel de Administrador"
          subtitle="Gerencie o conteúdo do portal RDT."
        />
        <button
          onClick={lock}
          className="text-white/50 hover:text-white text-sm font-condensed uppercase tracking-wide px-3 py-2.5 border border-white/15 rounded -mt-8"
        >
          Sair
        </button>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap border-b border-white/10 pb-5">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            className={`flex items-center gap-1.5 text-xs font-condensed font-semibold uppercase tracking-wide px-3.5 py-2 rounded-full border transition-colors ${
              section === s.key
                ? 'bg-rdt-gold text-rdt-black border-rdt-gold'
                : 'text-white/60 border-white/15 hover:border-rdt-gold/50 hover:text-white'
            }`}
          >
            <s.icon size={14} />
            {s.label}
          </button>
        ))}
      </div>

      {section === 'materias' && <MateriasAdminTab onAuthError={handleAuthError} />}
      {section === 'ticker' && <TickerAdminTab onAuthError={handleAuthError} />}
      {section === 'mercado' && <MercadoAdminTab onAuthError={handleAuthError} />}
      {section === 'nestedia' && <OnThisDayAdminTab onAuthError={handleAuthError} />}
      {section === 'enquete' && <PollAdminTab onAuthError={handleAuthError} />}
    </div>
  );
}
