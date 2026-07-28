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
});
