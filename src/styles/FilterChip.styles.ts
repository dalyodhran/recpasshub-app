import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/BoldBlueTheme';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 9999,
    marginRight: 12,
  },
  activeContainer: {
    backgroundColor: Colors.primary,
  },
  inactiveContainer: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
  },
  activeText: {
    color: Colors.onPrimary,
  },
  inactiveText: {
    color: Colors.onSurfaceVariant,
  },
});
