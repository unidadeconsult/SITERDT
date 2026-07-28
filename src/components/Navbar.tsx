import { useState } from 'react';
import { Menu, X, Shield, Share2 } from 'lucide-react';
import { navItems, type View } from '../navigation';

interface NavbarProps {
  current: View;
  onNavigate: (view: View) => void;
}

export default function Navbar({ current, onNavigate }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const go = (view: View) => {
    onNavigate(view);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-rdt-emerald-dark via-rdt-emerald to-rdt-emerald-dark border-b-2 border-rdt-gold shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => go('home')}
            className="flex items-center gap-2 group shrink-0"
          >
            <Shield className="text-rdt-gold" size={30} strokeWidth={2} />
            <span className="font-display font-extrabold text-lg sm:text-xl text-white tracking-tight">
              RDT <span className="text-rdt-gold">— Resenha da Torcida</span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => go(item.view)}
                className={`px-3 py-2 text-sm font-condensed font-medium uppercase tracking-wide rounded transition-colors ${
                  current === item.view
                    ? 'text-rdt-black bg-rdt-gold'
                    : 'text-white/85 hover:text-rdt-gold hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-rdt-gold text-rdt-black font-condensed font-semibold text-sm px-3 py-2 rounded hover:bg-white transition-colors"
            >
              <Share2 size={16} />
              Siga a RDT
            </a>
          </div>

          <button
            className="lg:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-rdt-emerald-dark border-t border-rdt-gold/30 px-4 py-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => go(item.view)}
              className={`text-left px-3 py-2.5 text-sm font-condensed font-medium uppercase tracking-wide rounded ${
                current === item.view
                  ? 'text-rdt-black bg-rdt-gold'
                  : 'text-white/85 hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 bg-rdt-gold text-rdt-black font-condensed font-semibold text-sm px-3 py-2.5 rounded"
          >
            <Share2 size={16} />
            Siga a RDT
          </a>
        </div>
      )}
    </header>
  );
}
