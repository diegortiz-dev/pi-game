import { StyleSheet } from 'react-native';
import { palette, spacing, radius, type } from '../theme';

export const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: palette.overlay.scrim,
  },
  sheet: {
    maxHeight: '86%',
    backgroundColor: palette.ink[800],
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: 1,
    borderColor: palette.ink[500],
    paddingHorizontal: spacing.lg,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: palette.ink[500],
    marginTop: spacing.md,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
  },
  title: {
    ...type.heading,
    color: palette.text.primary,
  },
  close: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.ink[500],
  },
  pressed: {
    opacity: 0.65,
  },

  body: {
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },

  /* Opções --------------------------------------------------------------- */
  group: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.ink[500],
    backgroundColor: palette.ink[700],
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  /** Fio entre opções, em vez de um cartão por opção. */
  optionDivided: {
    borderTopWidth: 1,
    borderColor: palette.ink[500],
  },
  optionIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: palette.ink[900],
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    ...type.body,
    color: palette.text.primary,
  },
  optionDescription: {
    ...type.bodySmall,
    fontSize: 12,
    color: palette.text.tertiary,
  },

  /** Explica quando o sistema está anulando uma chave do app. */
  note: {
    ...type.bodySmall,
    fontSize: 12,
    color: palette.text.tertiary,
    lineHeight: 18,
  },

  /* Idioma --------------------------------------------------------------- */
  languageGroup: {
    gap: spacing.sm,
  },
  languageLabel: {
    ...type.label,
    color: palette.text.secondary,
  },
  segmented: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.ink[500],
  },
  segmentActive: {
    borderColor: palette.gold.base,
    backgroundColor: palette.overlay.goldWash,
  },
  segmentText: {
    ...type.bodySmall,
    color: palette.text.tertiary,
  },
  segmentTextActive: {
    color: palette.gold.bright,
  },

  /* Ação destrutiva ------------------------------------------------------ */
  danger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.accent.danger,
  },
  dangerText: {
    ...type.body,
    color: palette.accent.danger,
  },

  footer: {
    ...type.bodySmall,
    fontSize: 12,
    color: palette.text.tertiary,
    textAlign: 'center',
    lineHeight: 19,
  },
});
