import React from "react";
import { View, useColorScheme } from "react-native";
import { SymbolView } from "expo-symbols";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { authStyles } from "@/styles/auth.styles";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  brandTitle?: string;
  showIcon?: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  brandTitle,
  showIcon = false,
}) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <View style={authStyles.headerContainer}>
      {brandTitle ? (
        <ThemedText style={[authStyles.brandTitle, { color: colors.primary }]}>
          {brandTitle}
        </ThemedText>
      ) : null}

      {showIcon ? (
        <View
          style={[
            authStyles.iconContainer,
            { backgroundColor: colors.primaryContainer },
          ]}
        >
          <SymbolView
            name={{ ios: "safari", android: "explore", web: "explore" }}
            size={32}
            tintColor={colors.primary}
          />
        </View>
      ) : null}

      <ThemedText style={authStyles.headerTitle}>{title}</ThemedText>
      <ThemedText
        style={[authStyles.headerSubtitle, { color: colors.textSecondary }]}
      >
        {subtitle}
      </ThemedText>
    </View>
  );
};
