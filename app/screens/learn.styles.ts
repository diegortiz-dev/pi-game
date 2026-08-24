import { StyleSheet } from 'react-native';
import { palette, spacing, radius, type } from '../theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.ink[800],
    paddingHorizontal: spacing.lg,
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
    width: 96,
  },
  backLabel: {
    ...type.bodySmall,
    color: palette.gold.base,
  },
  title: {
    ...type.label,
    color: palette.text.secondary,
  },
  blockCount: {
    ...type.data,
    fontSize: 12,
    width: 96,
    textAlign: 'right',
    color: palette.text.tertiary,
  },
  pressed: {
    opacity: 0.7,
  },

  /* Enunciado da rodada -------------------------------------------------- */
  /** Enunciado e casas juntos, centrados no espaço que sobra. */
  stage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
  },
  brief: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  range: {
    ...type.label,
    color: palette.gold.base,
  },
  round: {
    ...type.heading,
    color: palette.text.primary,
    marginTop: spacing.xs,
  },
  instruction: {
    ...type.bodySmall,
    color: palette.text.secondary,
    textAlign: 'center',
  },

  /* Painéis de conclusão -------------------------------------------------- */
  panel: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  panelTitle: {
    ...type.heading,
    color: palette.text.primary,
    marginTop: spacing.xs,
  },
  panelBody: {
    ...type.body,
    color: palette.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  primary: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: palette.gold.base,
  },
  primaryText: {
    ...type.heading,
    fontSize: 17,
    color: palette.ink[900],
  },
  secondaryRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  secondary: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.ink[500],
  },
  secondaryText: {
    ...type.body,
    color: palette.text.secondary,
  },

  /* Teclado --------------------------------------------------------------- */
  keypadArea: {
    alignItems: 'center',
  },
});
