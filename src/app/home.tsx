import React from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { PrimaryButton } from "@/components/auth";
import { Colors, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";

export default function HomeScreen() {
  const { logout } = useAuth();
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.content}>
        <ThemedText style={[styles.title, { color: colors.text }]}>
          You are signed in!
        </ThemedText>
        <PrimaryButton label="Log Out" onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.four,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: Spacing.four,
  },
});
