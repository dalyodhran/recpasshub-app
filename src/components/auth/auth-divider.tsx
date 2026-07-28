import { ThemedText } from "@/components/ui/themed-text";
import { Colors } from "@/constants/theme";
import { authStyles } from "@/styles/auth.styles";
import React from "react";
import { View, useColorScheme } from "react-native";

interface AuthDividerProps {
  label: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ label }) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <View style={authStyles.dividerRow}>
      <View
        style={[authStyles.dividerLine, { backgroundColor: colors.outline }]}
      />
      <ThemedText
        style={[authStyles.dividerText, { color: colors.textSecondary }]}
      >
        {label}
      </ThemedText>
      <View
        style={[authStyles.dividerLine, { backgroundColor: colors.outline }]}
      />
    </View>
  );
};
