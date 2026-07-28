import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0058be',
  },
  header: {
    backgroundColor: '#0058be',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  iconButton: {
    padding: 8,
    marginRight: -8,
    borderRadius: 20,
  },
});
