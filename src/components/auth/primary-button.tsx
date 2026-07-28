import React from "react";
import { ActivityIndicator, Pressable, useColorScheme } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { authStyles } from "@/styles/auth.styles";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  isLoading = false,
  disabled = false,
}) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <Pressable
      style={({ pressed }) => [
        authStyles.submitButton,
        { backgroundColor: colors.primary },
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
