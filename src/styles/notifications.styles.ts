import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/BoldBlueTheme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
    gap: 12, // React Native spacing between items
  },
  
  // Notification Card Base
  notificationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    borderColor: Colors.outlineVariant,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden', // to contain the unread indicator
  },
  
  // Unread Indicator
  unreadIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.primary,
  },

  // Icon Area
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  iconUnread: {
    backgroundColor: Colors.primaryContainer,
  },
  iconRead: {
    backgroundColor: Colors.surfaceVariant,
  },

  // Text Content Area
  textContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onSurface,
    flex: 1,
  },
  timeTextUnread: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  timeTextRead: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  messageText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },

  // Empty State
  emptyStateContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginTop: 8,
  }
});
