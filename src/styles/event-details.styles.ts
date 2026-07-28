import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/BoldBlueTheme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Header / Hero Image
  heroImageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.surfaceContainerLow,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(247, 249, 251, 0.4)', // Rough approximation of the gradient to-background
    // We can use expo-linear-gradient if available, but a solid overlay or nothing is fine for a mock
  },
  contentContainer: {
    marginTop: -32,
    paddingHorizontal: 16,
    zIndex: 10,
    gap: 24,
    paddingBottom: 100, // padding for sticky bottom actions
  },
  
  // Event Header Card
  headerCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sportBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  sportBadgeText: {
    color: Colors.onPrimary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.onSurface,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  metaText: {
    fontSize: 16,
    color: Colors.onSurfaceVariant,
  },
  
  // Section Headings
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.onSurface,
    marginBottom: 8,
  },
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 32 - 12) / 2, // 2 columns minus paddings and gaps
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 88, 190, 0.1)', // Primary / 10%
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  
  // About
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.onSurfaceVariant,
  },
  
  // FAQs
  faqsContainer: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 32,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  faqQuestionBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.onSurface,
    flex: 1,
  },
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswerText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  
  // Bottom Sticky Actions
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(247, 249, 251, 0.95)',
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
    padding: 16,
    zIndex: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  sponsorBanner: {
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sponsorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sponsorIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sponsorLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  sponsorName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.onSurface,
  },
  sponsorLink: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  joinButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  joinButtonText: {
    color: Colors.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
