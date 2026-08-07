import type { Category } from '../types';

export default function CategoryTag({
  category,
  className = '',
}: {
  category: Category;
  className?: string;
}) {
  return (
    <span
      className={`inline-block bg-rdt-gold text-rdt-black font-condensed font-bold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-sm ${className}`}
    >
      {category}
    </span>
  );
}
