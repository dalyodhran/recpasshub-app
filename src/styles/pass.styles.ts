import { StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/BoldBlueTheme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Header Area
  header: {
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 20,
  },
  headerTopRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0)', // Will add hover/press effect in component
  },
  successIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: Colors.onPrimary,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.onPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.primaryFixed, // A lighter blue if available, fallback to something else
  },

  // Main Card Area
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: -20, // Overlap the header slightly
    paddingBottom: 40,
    zIndex: 30,
  },
  passCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderColor: Colors.outlineVariant,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 24,
    overflow: 'hidden',
  },
  
  // Ticket Stub Top
  passTopSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    borderStyle: 'dashed',
    position: 'relative',
  },
  passEventTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.onBackground,
    textAlign: 'center',
    marginBottom: 4,
  },
  passVipLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 24,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  dtColumn: {
    flexDirection: 'column',
  },
  dtColumnRight: {
    alignItems: 'flex-end',
  },
  dtLabel: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dtValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  
  // Cutouts for ticket stub effect
  cutoutLeft: {
    position: 'absolute',
    left: -12,
    bottom: -12,
    width: 24,
    height: 24,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    transform: [{ rotate: '45deg' }],
    zIndex: 20,
  },
  cutoutRight: {
    position: 'absolute',
    right: -12,
    bottom: -12,
    width: 24,
    height: 24,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    transform: [{ rotate: '-45deg' }],
    zIndex: 20,
  },

  // QR Code Section
  passBottomSection: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
  },
  qrCodeBox: {
    width: 192,
    height: 192,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  qrCodeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  qrScannerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  passIdText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 2,
  },

  // Actions
  actionButtonsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryBtnText: {
    color: Colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: 14, // slightly less to account for border
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },

  // Footer
  footer: {
    alignItems: 'center',
    opacity: 0.7,
  },
  footerLabel: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  sponsorImage: {
    height: 32,
    width: 128,
    resizeMode: 'contain',
    opacity: 0.8,
  }
});
