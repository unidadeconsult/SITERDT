import { Link } from 'react-router-dom';
import { Shield, Share2, AtSign, Radio, Play } from 'lucide-react';
import { navItems } from '../navigation';

export default function Footer() {
  return (
    <footer className="bg-rdt-black border-t border-rdt-gold/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
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
