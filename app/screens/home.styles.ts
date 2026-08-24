import { StyleSheet } from 'react-native';
import { palette, spacing, radius, type } from '../theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.ink[800],
    paddingHorizontal: spacing.lg,
  },

  /* Cabeçalho ----------------------------------------------------------- */
  /*
   * Um botão em cada ponta, em vez dos dois amontoados à direita: assim
   * nenhum dos dois lê como um enfeite espremido no canto.
   */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 46,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.ink[500],
    backgroundColor: palette.ink[700],
  },
  headerButtonText: {
    ...type.data,
    fontSize: 15,
    color: palette.text.secondary,
  },
  headerIcon: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.ink[500],
    backgroundColor: palette.ink[700],
  },
  pressed: {
    opacity: 0.65,
  },

  /* Corpo ---------------------------------------------------------------- */
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xxl,
  },

  /* Herói ---------------------------------------------------------------- */
  /*
   * `alignSelf: stretch` nos dois é o que impede o conteúdo de estourar a
   * largura da tela: com apenas `alignItems: center`, um filho de texto assume a
   * largura do próprio conteúdo em vez da largura do pai, não quebra linha e
   * arrasta o container inteiro junto.
   */
  hero: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: spacing.xl,
  },
  readout: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  /** O recorde é o segundo herói: grande o bastante para ser lido de longe. */
  record: {
    ...type.score,
    fontSize: 56,
    lineHeight: 58,
    color: palette.text.primary,
  },
  recordLabel: {
    ...type.label,
    color: palette.text.tertiary,
    marginTop: spacing.xs,
  },
  goal: {
    ...type.bodySmall,
    color: palette.gold.bright,
    marginTop: spacing.md,
  },
  /** Só aparece antes da primeira partida, quando não há número a mostrar. */
  tagline: {
    ...type.heading,
    color: palette.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },

  /* Modos ---------------------------------------------------------------- */
  /**
   * Um único bloco com um fio no meio, em vez de dois cartões separados.
   * Menos bordas competindo entre si.
   */
  modes: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.ink[500],
    backgroundColor: palette.ink[700],
    overflow: 'hidden',
  },
  mode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  modeDivided: {
    borderTopWidth: 1,
    borderColor: palette.ink[500],
  },
  modePressed: {
    backgroundColor: palette.ink[600],
  },
  modeTitle: {
    ...type.heading,
    fontSize: 22,
    lineHeight: 28,
    flex: 1,
    color: palette.text.primary,
  },
  modeMeta: {
    ...type.data,
    fontSize: 14,
    color: palette.text.tertiary,
  },

  credit: {
    ...type.bodySmall,
    color: palette.text.tertiary,
    textAlign: 'center',
  },
});
