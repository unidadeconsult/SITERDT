export type View =
  | 'home'
  | 'mercado'
  | 'nestedia'
  | 'mural'
  | 'colunas'
  | 'prancheta'
  | 'article';

export interface NavItem {
  label: string;
  view: View;
}

export const navItems: NavItem[] = [
  { label: 'Início', view: 'home' },
  { label: 'Mercado da Bola', view: 'mercado' },
  { label: 'Neste Dia no Futebol', view: 'nestedia' },
  { label: 'Mural da Torcida', view: 'mural' },
  { label: 'Colunas', view: 'colunas' },
  { label: 'Prancheta Tática', view: 'prancheta' },
];
