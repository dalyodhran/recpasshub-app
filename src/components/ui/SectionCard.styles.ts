import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(194, 198, 214, 0.3)",
    overflow: "hidden",
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(236, 238, 240, 0.3)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(194, 198, 214, 0.5)",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#505f76",
    letterSpacing: 1,
  },
});
