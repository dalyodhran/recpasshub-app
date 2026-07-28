import { StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/BoldBlueTheme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Header
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    zIndex: 50,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 3,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onPrimary,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.onPrimary,
    opacity: 0.8,
  },
  
  // Message List
  messageListContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // Make room for input
    gap: 16,
  },
  dateSeparatorContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateSeparator: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  dateSeparatorText: {
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: '600',
  },
  
  // Bubbles
  messageRow: {
    flexDirection: 'column',
    maxWidth: '85%',
  },
  messageRowReceived: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  messageRowSent: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  bubble: {
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleReceived: {
    backgroundColor: Colors.surfaceContainerHighest,
    borderTopLeftRadius: 0,
  },
  bubbleSent: {
    backgroundColor: Colors.primary,
    borderTopRightRadius: 0,
  },
  bubbleTextReceived: {
    color: Colors.onSurface,
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextSent: {
    color: Colors.onPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  timestampReceived: {
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
  },
  timestampSent: {
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    marginTop: 4,
    marginRight: 4,
  },

  // Bottom Input
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 40,
  },
  addIconContainer: {
    padding: 8,
    borderRadius: 20,
  },
  textInputWrapper: {
    flex: 1,
  },
  textInput: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 14,
    color: Colors.onSurface,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
