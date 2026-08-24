import { StyleSheet } from 'react-native';
import { palette, spacing, radius, type } from '../theme';

export const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: palette.overlay.scrim,
  },
  sheet: {
    maxHeight: '92%',
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

  /* Resumo --------------------------------------------------------------- */
  summary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderColor: palette.ink[500],
  },
  summaryCell: {
    width: '33.33%',
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: palette.ink[500],
  },
  summaryValue: {
    ...type.dataLarge,
    fontSize: 22,
    color: palette.text.primary,
  },
  summaryLabel: {
    ...type.label,
    fontSize: 8,
    color: palette.text.tertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },

  /* Cabeçalho de seção --------------------------------------------------- */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...type.label,
    color: palette.text.secondary,
  },
  sectionPercent: {
    ...type.data,
    fontSize: 13,
    color: palette.gold.bright,
  },

  /* Barra de progresso --------------------------------------------------- */
  track: {
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: palette.ink[600],
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  trackFillDone: {
    backgroundColor: palette.gold.bright,
  },
  trackFillPending: {
    backgroundColor: palette.ink[500],
  },

  /* Filtros -------------------------------------------------------------- */
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filter: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.ink[500],
  },
  filterActive: {
    borderColor: palette.gold.base,
    backgroundColor: palette.overlay.goldWash,
  },
  filterText: {
    ...type.bodySmall,
    color: palette.text.tertiary,
  },
  filterTextActive: {
    color: palette.gold.bright,
  },

  empty: {
    ...type.body,
    color: palette.text.tertiary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },

  /* Conquistas ----------------------------------------------------------- */
  list: {
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  cardUnlocked: {
    borderColor: palette.gold.dim,
    backgroundColor: palette.ink[700],
  },
  cardLocked: {
    borderColor: palette.ink[500],
    backgroundColor: 'transparent',
  },
  cardIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: palette.ink[900],
  },
  cardIconUnlocked: {
    backgroundColor: palette.overlay.goldWash,
  },
  cardBody: {
    flex: 1,
    gap: 3,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardTitle: {
    ...type.body,
    fontFamily: type.heading.fontFamily,
    color: palette.text.primary,
    flexShrink: 1,
  },
  cardTitleLocked: {
    color: palette.text.secondary,
  },
  cardMetric: {
    ...type.label,
    fontSize: 10,
    letterSpacing: 0.5,
    color: palette.text.tertiary,
  },
  cardDescription: {
    ...type.bodySmall,
    fontSize: 12,
    color: palette.text.tertiary,
  },
});
