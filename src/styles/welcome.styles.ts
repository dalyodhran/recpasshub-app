import { StyleSheet } from "react-native";
import { Spacing } from "@/constants/theme";

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeaderBanner: {
    width: "100%",
    paddingBottom: Spacing.three,
    alignItems: "center",
    justifyContent: "center",
  },
  topHeaderTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    gap: Spacing.three,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subheading: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: Spacing.three,
  },
  choiceCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: 16,
    borderWidth: 2,
  },
  choiceCardPressed: {
    opacity: 0.85,
  },
  choiceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  choiceText: {
    flex: 1,
    gap: Spacing.one,
  },
  choiceTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  choiceDescription: {
    fontSize: 14,
  },
  footnote: {
    fontSize: 13,
    textAlign: "center",
    marginTop: Spacing.two,
  },
});
