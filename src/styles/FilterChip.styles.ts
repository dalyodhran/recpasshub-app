import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/BoldBlueTheme';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    marginRight: 12,
  },
  activeContainer: {
    backgroundColor: Colors.primary,
  },
  inactiveContainer: {
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.12,
  },
  activeText: {
    color: Colors.onPrimary,
  },
  inactiveText: {
    color: Colors.onSurfaceVariant,
  },
});
