import { ThemedText } from "@/components/ui/themed-text";
import { Colors } from "@/constants/theme";
import { authStyles } from "@/styles/auth.styles";
import { SFSymbol, SymbolView } from "expo-symbols";
import React from "react";
import { Pressable, View, useColorScheme } from "react-native";

export type AuthRole = "attendee" | "organizer";

interface RoleSwitcherProps {
  role: AuthRole;
  onRoleChange: (newRole: AuthRole) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ role, onRoleChange }) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <View style={[authStyles.roleSwitcherContainer, { backgroundColor: colors.surfaceVariant }]}>
      {/* Attendee Tab */}
      <Pressable
        onPress={() => onRoleChange("attendee")}
        style={[
          authStyles.roleTab,
          role === "attendee"
            ? [authStyles.roleTabActive, { backgroundColor: colors.backgroundElement }]
            : null,
        ]}
      >
        <SymbolView
          name={{ ios: "person.fill" as SFSymbol, android: "sports_kabaddi", web: "sports_kabaddi" }}
          size={18}
          tintColor={role === "attendee" ? colors.text : colors.textSecondary}
        />
        <ThemedText
          style={[
            authStyles.roleTabText,
            { color: role === "attendee" ? colors.text : colors.textSecondary },
          ]}
        >
          Attendee
        </ThemedText>
      </Pressable>

      {/* Organizer Tab */}
      <Pressable
        onPress={() => onRoleChange("organizer")}
        style={[
          authStyles.roleTab,
          role === "organizer"
            ? [authStyles.roleTabActive, { backgroundColor: colors.backgroundElement }]
            : null,
        ]}
      >
        <SymbolView
          name={{ ios: "sportscourt.fill" as SFSymbol, android: "stadium", web: "stadium" }}
          size={18}
          tintColor={role === "organizer" ? colors.text : colors.textSecondary}
        />
        <ThemedText
          style={[
            authStyles.roleTabText,
            { color: role === "organizer" ? colors.text : colors.textSecondary },
          ]}
        >
          Organizer
        </ThemedText>
      </Pressable>
    </View>
  );
};
