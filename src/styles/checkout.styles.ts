import { StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/BoldBlueTheme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
  waiverBoxContainer: {
    flex: 1,
    marginBottom: 24,
    position: 'relative',
    minHeight: 200,
  },
  waiverBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: 'rgba(0, 88, 190, 0.2)', // primary with 20% opacity
    borderRadius: 8,
  },
  waiverContent: {
    padding: 16,
  },
  waiverTextBold: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 16,
  },
  waiverText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 16,
  },
  signatureSection: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: 'rgba(0, 88, 190, 0.2)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  signatureLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
  },
  signaturePad: {
    height: 128, // h-32
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(0, 88, 190, 0.4)',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  signaturePlaceholder: {
    fontSize: 14,
    color: 'rgba(0, 88, 190, 0.6)',
  },
  signatureControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  checkoutSection: {
    marginTop: 'auto',
    paddingBottom: Platform.OS === 'ios' ? 0 : 24,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: 'rgba(0, 88, 190, 0.2)',
    paddingTop: 8,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
  payButton: {
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
    elevation: 3,
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.onPrimary,
  },
});
