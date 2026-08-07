import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Share2, AtSign, Radio, Play, Mail, Loader2, Check } from 'lucide-react';
import { navItems } from '../navigation';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === 'sending') return;
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/feed?type=newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus('done');
        setEmail('');
      } else {
        setStatus('error');
        setError(data.error || 'Falha ao inscrever. Tente novamente.');
      }
    } catch {
      setStatus('error');
      setError('Falha ao inscrever. Verifique sua conexão.');
    }
  };

  return (
    <footer className="bg-rdt-black border-t border-rdt-gold/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="text-rdt-gold" size={26} />
            <span className="font-display font-extrabold text-white text-lg">
              RDT — Resenha da Torcida
            </span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm">
            Jornalismo esportivo, memória e crônica do futebol brasileiro e internacional.
            Notícias, acervo histórico e a paixão da torcida em um só lugar.
          </p>
        </div>

        <div>
          <h3 className="font-condensed uppercase text-rdt-gold text-sm tracking-wider mb-3">
            Seções
          </h3>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-condensed uppercase text-rdt-gold text-sm tracking-wider mb-3">
            Redes Sociais
          </h3>
          <div className="flex gap-3">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/5 text-white/70 hover:text-rdt-gold hover:bg-white/10 transition-colors"
            >
              <AtSign size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/5 text-white/70 hover:text-rdt-gold hover:bg-white/10 transition-colors"
            >
              <Radio size={18} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/5 text-white/70 hover:text-rdt-gold hover:bg-white/10 transition-colors"
            >
              <Play size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-rdt-gold text-rdt-black text-xs font-semibold"
            >
              <Share2 size={14} />
              Seguir
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-condensed uppercase text-rdt-gold text-sm tracking-wider mb-3">
            Newsletter
          </h3>
          {status === 'done' ? (
            <p className="flex items-center gap-2 text-white/70 text-sm">
              <Check size={16} className="text-rdt-gold" />
              Inscrição confirmada!
            </p>
          ) : (
            <form onSubmit={subscribe} className="flex flex-col gap-2">
              <p className="text-white/50 text-sm leading-relaxed mb-1">
                Receba as principais matérias direto no seu e-mail.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-rdt-gold"
                />
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="flex items-center justify-center gap-1.5 bg-rdt-gold text-rdt-black text-xs font-semibold px-3 py-2 rounded hover:bg-white transition-colors disabled:opacity-50 shrink-0"
                >
                  {status === 'sending' ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                  Inscrever
                </button>
              </div>
              {status === 'error' && <p className="text-red-400 text-xs">{error}</p>}
            </form>
          )}
        </div>
      </div>
      <div className="border-t border-white/5 py-5 flex items-center justify-center gap-3 text-center text-white/30 text-xs">
        <span>© 2026 RDT — Resenha da Torcida. Todos os direitos reservados.</span>
        <Link to="/admin" className="hover:text-white/60 transition-colors">
          Admin
        </Link>
      </div>
    </footer>
  );
}
