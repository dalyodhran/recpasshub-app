import { ThemedText } from "@/components/ui/themed-text";
import { Colors } from "@/constants/theme";
import { authStyles } from "@/styles/auth.styles";
import React from "react";
import { ActivityIndicator, Pressable, useColorScheme } from "react-native";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  primaryColor?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  isLoading = false,
  disabled = false,
  primaryColor,
}) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <Pressable
      style={({ pressed }) => [
        authStyles.submitButton,
        { backgroundColor: primaryColor || colors.primary },
        (pressed || disabled) && {
          opacity: 0.88,
          transform: [{ scale: 0.98 }],
        },
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <ThemedText
          style={[authStyles.submitText, { color: colors.onPrimary }]}
        >
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
};
