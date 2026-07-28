import { ThemedText } from "@/components/ui/themed-text";
import { Colors } from "@/constants/theme";
import { authStyles } from "@/styles/auth.styles";
import { SFSymbol, SymbolView } from "expo-symbols";
import React, { useState } from "react";
import {
  Pressable,
  TextInput,
  TextInputProps,
  View,
  useColorScheme,
} from "react-native";

interface LabeledInputProps extends TextInputProps {
  label: string;
  iconName: SFSymbol;
  isPassword?: boolean;
  rightHeaderAction?: React.ReactNode;
}

export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  iconName,
  isPassword = false,
  rightHeaderAction,
  ...inputProps
}) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={authStyles.inputGroup}>
      <View style={authStyles.labelRow}>
        <ThemedText style={authStyles.label}>{label}</ThemedText>
        {rightHeaderAction}
      </View>

      <View
        style={[
          authStyles.inputWrapper,
          {
            borderColor: colors.outline,
            backgroundColor: colors.backgroundElement,
          },
        ]}
      >
        <SymbolView
          name={{ ios: iconName, android: "person", web: "person" }}
          size={18}
          tintColor={colors.textSecondary}
        />
        <TextInput
          style={[authStyles.input, { color: colors.text }]}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={isPassword && !showPassword}
          {...inputProps}
        />

        {isPassword ? (
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <SymbolView
              name={{
                ios: showPassword ? "eye.slash.fill" : "eye.fill",
                android: showPassword ? "visibility_off" : "visibility",
                web: showPassword ? "visibility_off" : "visibility",
              }}
              size={18}
              tintColor={colors.textSecondary}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};
