import { ThemedText } from "@/components/ui/themed-text";
import { Colors } from "@/constants/theme";
import { authStyles } from "@/styles/auth.styles";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Pressable, View, useColorScheme } from "react-native";

interface SocialAuthButtonsProps {
  onPressGoogle: () => void;
  onPressApple: () => void;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onPressGoogle,
  onPressApple,
}) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <View style={authStyles.socialContainer}>
      <Pressable
        style={({ pressed }) => [
          authStyles.socialButton,
          {
            borderColor: colors.outline,
            backgroundColor: colors.backgroundElement,
          },
          pressed && { opacity: 0.8 },
        ]}
        onPress={onPressGoogle}
      >
        <SymbolView
          name={{
            ios: "g.circle.fill",
            android: "account_box",
            web: "account_box",
          }}
          size={20}
          tintColor={colors.primary}
        />
        <ThemedText style={authStyles.socialText}>
          Continue with Google
        </ThemedText>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          authStyles.socialButton,
          {
            borderColor: colors.outline,
            backgroundColor: colors.backgroundElement,
          },
          pressed && { opacity: 0.8 },
        ]}
        onPress={onPressApple}
      >
        <SymbolView
          name={{ ios: "apple.logo", android: "lock", web: "lock" }}
          size={20}
          tintColor={colors.text}
        />
        <ThemedText style={authStyles.socialText}>
          Continue with Apple
        </ThemedText>
      </Pressable>
    </View>
  );
};
