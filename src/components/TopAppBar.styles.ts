import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/BoldBlueTheme';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.onPrimary,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  iconButtonPlaceholder: {
    width: 40,
  },
});
