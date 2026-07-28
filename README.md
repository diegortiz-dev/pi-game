# pi-game

Pi-Game — jogo casual desenvolvido com React Native e Expo.

Visão geral

Pi-Game é um protótipo de jogo para dispositivos móveis e web que explora mecânicas simples, feedback tátil e interfaces minimalistas. O projeto foi implementado em TypeScript sobre Expo para facilitar testes rápidos em Android, iOS e navegador.

Destaques

- Experiência multiplataforma (Android, iOS, Web) via Expo
- Código em TypeScript com componentes React Native reutilizáveis
- UX focada em ritmo e feedback tátil (haptics)

Como experimentar (rápido)

1. Instale dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run start
```

3. Rode em uma plataforma:

```bash
npm run android    # em dispositivo/emulador Android
npm run ios        # em simulador iOS
npm run web        # em navegador
```

Arquitetura e arquivos principais

- `App.tsx` — ponto de entrada e configuração das rotas
- `index.ts` — bootstrap do app
- `app/` — código-fonte principal
  - `app/components/` — componentes reutilizáveis (ex.: `StatsModal.tsx`)
  - `app/screens/` — telas do app (`home.tsx`, `game.tsx`)
  - `app/types.ts` — definições de tipos e interfaces
- `assets/` — recursos (imagens, fontes, etc.)

Design e gameplay

O jogo foca em sessões curtas e mecânicas fáceis de aprender. A interface prioriza clareza das informações e retorno sensorial através de vibração (quando disponível). Pequenas estatísticas são exibidas ao final de cada partida para incentivar repetição.

Dependências principais

- Expo
- React Native
- React Navigation
- Async Storage

