import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/BoldBlueTheme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  
  // Header
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
  
  // Segmented Control
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(194, 198, 214, 0.5)', // outline-variant with opacity
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },
  segmentTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  
  // Passes List
  listContainer: {
    flex: 1,
  },
  cardsContainer: {
    gap: 16,
    paddingBottom: 24,
  },
  
  // Pass Card Common
  passCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  passCardActiveBorder: {
    borderWidth: 2,
    borderColor: 'rgba(0, 88, 190, 0.2)', // primary/20
  },
  passCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  passDate: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.03,
    marginBottom: 4,
  },
  passTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  passLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  passLocation: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  
  // Badges
  badgeActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 6,
  },
  badgeActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.onPrimary,
  },
  badgeActiveText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.onPrimary,
  },
  badgeRegistered: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  badgeRegisteredText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: 'rgba(194, 198, 214, 0.5)', // outline-variant/50
    width: '100%',
    marginVertical: 12,
  },
  
  // Pass Card Bottom
  passCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bibLabel: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  bibNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  bibPending: {
    fontWeight: '600',
  },
  
  // Buttons
  btnActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  btnActiveText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.onPrimary,
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  btnSecondaryText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
});
