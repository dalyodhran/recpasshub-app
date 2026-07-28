import { StyleSheet } from "react-native";
import { Colors } from "@/constants/BoldBlueTheme";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.outlineVariant,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logoInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainer,
    overflow: "hidden",
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.onSurface,
    lineHeight: 24,
  },
  organizer: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.onSurfaceVariant,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.33,
  },
  detailsGrid: {
    flexDirection: "row",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerHigh,
  },
  detailCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.outline,
    letterSpacing: 0.33,
    marginBottom: 2,
  },
  detailValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.onSurface,
  },
});
