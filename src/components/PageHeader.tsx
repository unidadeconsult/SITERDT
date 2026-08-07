import type { LucideIcon } from 'lucide-react';

export default function PageHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="border-b border-rdt-gold/20 pb-6 mb-8">
      <div className="flex items-center gap-3">
        <div className="bg-rdt-gold/10 p-2.5 rounded-lg">
          <Icon className="text-rdt-gold" size={28} />
        </div>
        <h1 className="font-display font-extrabold text-white text-2xl sm:text-4xl">{title}</h1>
      </div>
      {subtitle && <p className="text-white/50 mt-3 max-w-2xl text-sm sm:text-base">{subtitle}</p>}
    </div>
  );
}
