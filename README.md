# π-Game

Jogo de memorização dos dígitos de π, em React Native com Expo. Android, iOS e web.

Disponível em português e inglês.

## O jogo

Três modos:

| | Aprender | Desafio | Prática |
|---|---|---|---|
| Relógio | nenhum | 60 segundos | nenhum |
| Ao errar | repete o dígito | custa 10 segundos | continua, só avisa |
| Dica | não existe | custa 5 segundos | livre |

### Aprender

O modo que ensina, em blocos de dez dígitos e três rodadas: na primeira os dez
estão à vista e você só acompanha; na segunda metade some; na terceira você
recita de cabeça. O apoio sai aos poucos, em vez de existir ou não existir — que
é a diferença entre treinar e ser testado.

Ao fechar as três rodadas o bloco é marcado como fixado e o seguinte abre. O app
retoma no primeiro bloco ainda não dominado.

### Desafio e Prática

Uma dica revela o próximo dígito e avança a posição, mas **não conta como
dígito lembrado**. Recordes, conquistas e o total acumulado saem apenas de
`recalled` — os dígitos que vieram da memória. Sem isso, segurar "Dica" seria um
atalho para qualquer conquista.

No Desafio um erro custa dez segundos em vez de encerrar a partida. Encerrar na
hora criava tensão, mas desestimulava justamente o momento de arriscar o dígito
seguinte, que é quando se aprende.

Os marcos de dígitos (Primeiro Passo até Lenda do Círculo) medem só o Desafio.
A Prática é ilimitada e sem pressão, então tem a própria trilha de conquistas.

## Rodando

```bash
npm install
npm start          # escolha a plataforma no menu do Expo
npm run android
npm run ios
npm run web
```

Verificação sem dispositivo:

```bash
npm test                          # regras de jogo, conquistas, storage, traduções
npm run typecheck
npx expo export --platform web    # o bundle compila?
```

Os testes cobrem a lógica pura: dígitos de π, conquistas, a mecânica do Aprender,
a migração do storage e a consistência das traduções. Nada de componente — a
regra foi separada das telas justamente para poder ser verificada sozinha.

## Estrutura

```
App.tsx                     carrega fontes, provê configurações, monta a navegação
app/
  theme/                    tokens: cores, espaçamento, raios, tipografia
  constants/
    pi.ts                   10.000 dígitos de π + acesso seguro por índice
    storage.ts              chaves do AsyncStorage
  data/
    achievements.ts         fonte única das conquistas
    learn.ts                mecânica do Modo Aprender, em funções puras
  i18n/
    strings.ts              todo o texto, pt e en lado a lado
    index.ts                resolução de idioma e interpolação
  storage/
    progress.ts             recordes e estatísticas, com migração da v1
    settings.ts             preferências, com migração da v1
  hooks/
    useGameEngine.ts        toda a regra de uma partida
    useLearnSession.ts      liga a mecânica do Aprender a som, tato e progresso
    useSettings.tsx         preferências, idioma e tradução
  utils/
    sound.ts                efeitos via expo-audio
    haptics.ts              retorno tátil
  components/               BrandMark, ScoreGauge, PiTape, Keypad, modais, ErrorBoundary
  screens/                  home, game e learn (estilos em .styles.ts)
```

### Onde ficam as decisões

- **Regra de jogo** — `app/hooks/useGameEngine.ts`. A tela só desenha o estado.
- **Conquistas** — `app/data/achievements.ts`. Cada uma declara um alvo e de
  qual estatística lê. Adicionar uma é acrescentar um item nessa lista; o aviso
  em partida e o modal de progresso saem os dois dela.
- **Cores e tipografia** — `app/theme/index.ts`. Nenhum hexadecimal solto nos
  componentes.
- **Texto** — `app/i18n/strings.ts`. Os dois idiomas ficam na mesma chave, então
  uma tradução faltando vira erro de tipo em vez de chave crua na tela.

## Design

A identidade vem do ícone do app: disco navy (`#0A1628`) com anel dourado
(`#AB8B0C`). O dourado ganhou três degraus, porque o valor único de antes não
permitia hierarquia.

O elemento central é o medidor em arco: π é a razão entre circunferência e
diâmetro, um círculo desenrolado numa linha. O anel mostra o lado circular, a
fita de dígitos mostra o lado reto. O anel interno tem dez segmentos porque é em
blocos de dez que se memoriza π; o anel externo é o tempo restante e só aparece
no Desafio.

Tipografia: **Space Grotesk** nos títulos e no placar, **IBM Plex Mono** nos
dígitos. A monoespaçada é escolha funcional — com largura fixa a fita não se
reorganiza a cada dígito novo.

Contrastes de texto foram conferidos pela fórmula WCAG 2.1 contra o fundo e
estão anotados em `app/theme/index.ts`.

## Efeitos sonoros

Os quatro WAV em `assets/sfx/` são sintetizados, não gravados. São tocados pelo
`expo-audio` com um pequeno pool de players por som, para que toques rápidos não
esperem o *seek* de volta ao início.

O modo de áudio é `mixWithOthers`: o jogo não interrompe a música de quem está
ouvindo, e respeita a chave de silencioso do iOS.

## Acessibilidade

Todo alvo de toque tem rótulo. Os contrastes de texto foram conferidos pela
fórmula WCAG 2.1 e estão anotados em `app/theme/index.ts`.

O tremor ao errar respeita o "reduzir movimento" do sistema, não só a chave do
app: quem liga essa opção no aparelho costuma fazê-lo por sensibilidade
vestibular, e essa escolha vale mais que o padrão daqui.

## Persistência

Tudo local, via AsyncStorage, em duas chaves JSON (`@pi_game/progress/v2` e
`@pi_game/settings/v2`). Nada sai do aparelho.

A primeira versão usava sete chaves soltas de string. `loadProgress` e
`loadSettings` leem essas chaves antigas uma única vez, convertem e as apagam —
quem já jogava não perde recorde.

O progresso é gravado em lote: ao errar, ao acabar o tempo, ao sair da tela, ao
app ir para segundo plano, ao desbloquear uma conquista, e a cada 15 dígitos numa
partida longa.

## Autor

Diego Ortiz
