# RDT — Resenha da Torcida

Portal de jornalismo esportivo, memória e crônica do futebol brasileiro e internacional, com placar ao vivo, mercado da bola, enquetes, mural da torcida e prancheta tática interativa.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- lucide-react

## Rodando o projeto

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
```

## Estrutura

- `src/components` — componentes reutilizáveis (ticker, navbar, widgets, cards)
- `src/pages` — telas do portal (Início, Mercado da Bola, Neste Dia no Futebol, Mural da Torcida, Colunas, Prancheta Tática, Artigo)
- `src/data` — dados mockados (notícias, placares, transferências, formações etc.)
- `src/types.ts` — tipos compartilhados
