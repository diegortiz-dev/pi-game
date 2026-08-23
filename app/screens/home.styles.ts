import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1628',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 4,
    marginBottom: 0,
  },
  settingsIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#11243d',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  statsIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#11243d',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ab8b0c',
  },
  statsBtnText: {
    color: '#ab8b0c',
    fontSize: 14,
    fontWeight: '600',
  },
  laurelContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  appIcon: {
    width: 120,
    height: 120,
    borderRadius: 24,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#1e3a5f',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ab8b0c',
    marginBottom: 6,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 15,
    color: '#8badc9',
    marginBottom: 6,
    textAlign: 'center',
  },
  greekQuote: {
    fontSize: 11,
    color: '#ab8b0c',
    marginBottom: 28,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.65,
    paddingHorizontal: 8,
  },

  // ── Cards horizontais ──────────────────────────────────────
  buttonsContainer: {
    width: '100%',
    gap: 14,
  },
  modeCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
  },
  timerCard: {
    backgroundColor: '#0e1f36',
    borderColor: '#ab8b0c',
    elevation: 6,
    shadowColor: '#ab8b0c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  practiceCard: {
    backgroundColor: '#0a1c30',
    borderColor: '#5b9bd5',
    elevation: 6,
    shadowColor: '#5b9bd5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  // ── Ícones laterais ─────────────────────────────────────────
  cardIconWrap: {
    width: 70,
    height: 70,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
  },
  timerIconWrap: {
    backgroundColor: 'rgba(171, 139, 12, 0.1)',
    borderColor: 'rgba(171, 139, 12, 0.4)',
  },
  practiceIconWrap: {
    backgroundColor: 'rgba(91, 155, 213, 0.1)',
    borderColor: 'rgba(91, 155, 213, 0.4)',
  },

  // ── Texto central ────────────────────────────────────────────
  cardTextBlock: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  timerTitle: {
    color: '#ffffff',
  },
  practiceTitle: {
    color: '#ffffff',
  },
  cardDesc: {
    fontSize: 12,
    color: '#8badc9',
    lineHeight: 17,
  },

  // ── Badges de modo ───────────────────────────────────────────
  timerBadgeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(171, 139, 12, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(171, 139, 12, 0.4)',
  },
  timerBadgeLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ab8b0c',
  },
  practiceBadgeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(91, 155, 213, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(91, 155, 213, 0.4)',
  },
  practiceBadgeLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5b9bd5',
  },

  // ── Chevron ──────────────────────────────────────────────────
  cardChevron: {
    marginLeft: 8,
    opacity: 0.8,
  },

  // ── Rodapé ───────────────────────────────────────────────────
  footerContainer: {
    alignItems: 'center',
    marginTop: 28,
    paddingVertical: 4,
  },
  footer: {
    fontSize: 12,
    color: '#4a6080',
    letterSpacing: 1,
  },
});
