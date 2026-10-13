import { StyleSheet } from "react-native";
import { Colors } from "@/constants/BoldBlueTheme";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.outlineVariant,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  photo: {
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceContainerLow,
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.outline,
  },
  photoImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: "cover",
  },
  photoLabel: {
    marginTop: 8,
    fontSize: 15,
    color: Colors.onSurface,
  },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  bookmark: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.onSurface,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  metaText: {
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    flexShrink: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerHigh,
  },
  fromLabel: {
    fontSize: 13,
    color: Colors.outline,
  },
  price: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.onSurface,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.onPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
});
