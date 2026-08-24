import { StyleSheet } from 'react-native';
import { palette, spacing, radius, type } from '../theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.ink[800],
    paddingHorizontal: spacing.lg,
    /** Garante que a última fileira de teclas nunca encoste na borda. */
    paddingBottom: spacing.sm,
  },

  /* Cabeçalho ----------------------------------------------------------- */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    /** Largura fixa nas pontas para o rótulo do modo ficar centrado de fato. */
    width: 76,
  },
  backPressed: {
    opacity: 0.6,
  },
  backLabel: {
    ...type.bodySmall,
    color: palette.gold.base,
  },
  mode: {
    ...type.label,
    color: palette.text.secondary,
  },
  clock: {
    width: 76,
    alignItems: 'flex-end',
  },
  clockValue: {
    ...type.data,
    color: palette.text.secondary,
  },

  /* Instrumento --------------------------------------------------------- */
  gaugeArea: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  metaItem: {
    ...type.label,
    color: palette.text.tertiary,
  },
  metaValue: {
    ...type.label,
    color: palette.gold.bright,
  },

  /** Fita + teclado. Medida em tempo real para dimensionar as teclas. */
  play: {
    flex: 1,
  },

  /* Avisos durante a partida -------------------------------------------- */
  retry: {
    ...type.bodySmall,
    color: palette.accent.danger,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  startCue: {
    ...type.bodySmall,
    color: palette.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  /* Resultado ------------------------------------------------------------ */
  result: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.xl,
  },
  resultTitle: {
    ...type.label,
    color: palette.text.secondary,
  },
  recordBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: palette.overlay.goldWash,
    borderWidth: 1,
    borderColor: palette.gold.dim,
  },
  recordBadgeText: {
    ...type.bodySmall,
    color: palette.gold.bright,
  },
  resultGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: palette.ink[500],
  },
  resultCell: {
    flex: 1,
    alignItems: 'center',
  },
  resultDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: palette.ink[500],
  },
  resultValue: {
    ...type.dataLarge,
    color: palette.text.primary,
  },
  resultLabel: {
    ...type.label,
    fontSize: 9,
    color: palette.text.tertiary,
    marginTop: spacing.xs,
  },
  missed: {
    ...type.body,
    color: palette.text.secondary,
    marginTop: spacing.lg,
  },
  missedDigit: {
    ...type.data,
    fontSize: 18,
    color: palette.accent.danger,
  },

  /* Ações ---------------------------------------------------------------- */
  primaryAction: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: palette.gold.base,
  },
  primaryActionText: {
    ...type.heading,
    fontSize: 17,
    color: palette.ink[900],
  },
  secondaryRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  secondaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.ink[500],
  },
  secondaryActionText: {
    ...type.body,
    color: palette.text.secondary,
  },
  pressed: {
    opacity: 0.7,
  },
});
