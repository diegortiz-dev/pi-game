import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 22, 40, 0.85)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#0a1628',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#11243d',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 6,
  },
  scrollContent: {
    marginTop: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8badc9',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#11243d',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8badc9',
  },
  achievementProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ab8b0c',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#11243d',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ab8b0c',
    borderRadius: 4,
  },
  achievementsList: {
    gap: 10,
    paddingBottom: 20,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#11243d',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    gap: 12,
  },
  achievementUnlocked: {
    borderColor: '#ab8b0c',
  },
  achievementLocked: {
    borderColor: '#1e3a5f',
    opacity: 0.6,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleUnlocked: {
    backgroundColor: 'rgba(171, 139, 12, 0.15)',
  },
  iconCircleLocked: {
    backgroundColor: '#0a1628',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  textLocked: {
    color: '#8badc9',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#8badc9',
  },
});
