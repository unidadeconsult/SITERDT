export interface NavItem {
  label: string;
  path: string;
}

export const navItems: NavItem[] = [
  { label: 'Início', path: '/' },
  { label: 'Mercado da Bola', path: '/mercado-da-bola' },
  { label: 'Neste Dia no Futebol', path: '/neste-dia-no-futebol' },
  { label: 'Mural da Torcida', path: '/mural-da-torcida' },
  { label: 'Colunas', path: '/colunas' },
  { label: 'Prancheta Tática', path: '/prancheta-tatica' },
];
