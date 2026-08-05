import { StyleSheet } from "react-native";
import { Spacing } from "@/constants/theme";

export const authStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  roleSwitcherContainer: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 10,
    marginBottom: Spacing.two,
  },
  roleTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  roleTabActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  roleTabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  topHeaderBanner: {
    width: "100%",
    paddingVertical: Spacing.three,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topHeaderTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  centerContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.four,
  },
  cardContainer: {
    width: "100%",
    maxWidth: 440,
    borderRadius: 16,
    padding: Spacing.five,
    gap: Spacing.four,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: Spacing.four,
    gap: Spacing.one,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  socialContainer: {
    gap: Spacing.two,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: Spacing.two,
  },
  socialText: {
    fontSize: 14,
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginVertical: Spacing.one,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
  },
  formContainer: {
    gap: Spacing.three,
  },
  errorText: {
    color: "#ba1a1a",
    fontSize: 13,
    textAlign: "center",
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  forgotLink: {
    fontSize: 13,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: "600",
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.two,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    marginTop: Spacing.four,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontWeight: "bold",
  },
});
