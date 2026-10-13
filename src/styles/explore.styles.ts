import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/BoldBlueTheme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary, // So the top safe area matches the AppBar
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: Colors.primaryOverlay,
  },
  locationPillText: {
    color: Colors.onPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surface,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.onSurface,
  },
  tuneButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  sectionCount: {
    fontSize: 14,
    color: Colors.outline,
  },
  filtersWrapper: {
    paddingVertical: 16,
    backgroundColor: Colors.background,
  },
  filtersContainer: {
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  stateIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  stateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.onSurface,
    marginBottom: 8,
    textAlign: 'center',
  },
  stateMessage: {
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  stateButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  stateButtonText: {
    color: Colors.onPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  stateButtonSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  stateButtonSecondaryText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: Colors.onSurfaceVariant,
  },
});
