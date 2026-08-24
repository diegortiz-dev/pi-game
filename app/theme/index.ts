/**
 * Tokens de design do π-Game.
 *
 * A identidade vem do ícone do app: um disco navy com anel dourado. Esses dois
 * valores (`ink.800` e `gold.base`) são a marca e não devem mudar sem trocar o
 * ícone junto. O resto da paleta foi construído em volta deles.
 *
 * Todo contraste de texto foi verificado contra `ink.800` pela fórmula WCAG 2.1.
 * A razão medida está anotada em cada cor de texto.
 */

export const palette = {
  /** Azuis do fundo, do mais profundo ao mais claro. */
  ink: {
    900: '#060F1D', // fundo absoluto — dá aos cartões um lugar para "flutuar"
    800: '#0A1628', // navy da marca, tirado do ícone
    700: '#11243D', // superfície elevada (cartões)
    600: '#17304F', // superfície pressionada / destacada
    500: '#1E3A5F', // fio de contorno
  },

  /**
   * Dourado em três degraus. O app antigo tinha `gold` e `goldMuted` com o mesmo
   * valor, o que tornava impossível destacar qualquer coisa.
   */
  gold: {
    dim: '#7A6308',    // réguas, estados inativos
    base: '#AB8B0C',   // o anel do ícone — bordas, ícones, marca (5.5:1)
    bright: '#E3B93F', // ênfase, estado ativo, o número da pontuação (9.7:1)
  },

  text: {
    primary: '#F2F6FB',   // 16.8:1
    secondary: '#8BADC9', // 7.9:1
    tertiary: '#5A7894',  // 4.1:1 — apenas para rótulos grandes, nunca corpo
  },

  /**
   * Semânticas. O vermelho antigo (#C0392B) dava apenas 3.3:1 sobre o navy e
   * reprovava em WCAG AA, apesar de ser usado em texto de erro.
   */
  accent: {
    success: '#6FD08C', // 9.6:1
    danger: '#E5544B',  // 4.9:1
    warning: '#E6C84E', // 11.4:1
  },

  /** Sobreposições para modais e realces. */
  overlay: {
    scrim: 'rgba(3, 8, 16, 0.82)',
    goldWash: 'rgba(171, 139, 12, 0.12)',
    dangerWash: 'rgba(229, 84, 75, 0.14)',
    successWash: 'rgba(111, 208, 140, 0.14)',
  },
} as const;

/** Escala de 4px. Toda margem e espaçamento do app sai daqui. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  huge: 48,
} as const;

/**
 * Raios contidos de propósito. O app deve parecer um instrumento de medida,
 * não um cartão de banco — por isso nada de cantos muito arredondados.
 */
export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999,
} as const;

/**
 * Famílias tipográficas.
 *
 * Space Grotesk carrega a personalidade: geométrica com irregularidades
 * deliberadas, e algarismos com caráter próprio.
 *
 * IBM Plex Mono cuida dos dígitos de π. Monoespaçada é uma escolha funcional,
 * não estética: a largura fixa impede que a fita de dígitos se reorganize a cada
 * acerto, e mantém as colunas alinhadas entre as linhas.
 */
export const fonts = {
  /**
   * Só para o caractere π.
   *
   * Nem Space Grotesk nem IBM Plex Mono trazem grego — os dois param em
   * latin-ext. Sem isso, cada plataforma desenhava o π com a própria fonte de
   * sistema: três formas diferentes para o caractere que dá nome ao app, sempre
   * mais leve que o texto ao redor. Fira Sans tem grego, então o π fica igual
   * em toda parte e sob nosso controle.
   */
  pi: 'FiraSans_400Regular',
  piBold: 'FiraSans_700Bold',

  display: 'SpaceGrotesk_700Bold',
  displayMedium: 'SpaceGrotesk_500Medium',
  body: 'SpaceGrotesk_400Regular',
  mono: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
  monoBold: 'IBMPlexMono_600SemiBold',
} as const;

/** Escala tipográfica. `tracking` é `letterSpacing` do React Native. */
export const type = {
  /** O número da pontuação. Grande o bastante para ser lido de relance. */
  score: { fontFamily: fonts.display, fontSize: 64, lineHeight: 66, letterSpacing: -2 },
  title: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36, letterSpacing: -0.8 },
  heading: { fontFamily: fonts.display, fontSize: 20, lineHeight: 26, letterSpacing: -0.3 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  bodySmall: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  /** Rótulos em caixa alta com muito espacejamento — o tom "gravado". */
  label: { fontFamily: fonts.monoMedium, fontSize: 11, lineHeight: 14, letterSpacing: 1.6 },
  /** A fita de π. */
  tape: { fontFamily: fonts.monoMedium, fontSize: 22, lineHeight: 34, letterSpacing: 1 },
  data: { fontFamily: fonts.monoMedium, fontSize: 16, lineHeight: 20 },
  dataLarge: { fontFamily: fonts.monoBold, fontSize: 24, lineHeight: 28 },
  key: { fontFamily: fonts.displayMedium, fontSize: 30, lineHeight: 34 },
} as const;

/** Durações de animação, em ms. */
export const timing = {
  instant: 90,
  fast: 160,
  normal: 260,
  slow: 420,
  toastHold: 2600,
} as const;

export const theme = { palette, spacing, radius, type, fonts, timing } as const;
export type Theme = typeof theme;

/**
 * Qual peso do π combina com um dado texto.
 * As famílias de display e a mono em negrito pedem o π em negrito.
 */
export function piFontFor(fontFamily?: string): string {
  const bold: string[] = [fonts.display, fonts.monoBold];
  return fontFamily && bold.includes(fontFamily) ? fonts.piBold : fonts.pi;
}
