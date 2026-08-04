import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  useRouter,
  useSegments,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/ui/animated-icon";
import { AuthProvider, useAuth } from "@/auth/AuthContext";
import { KeycloakProvider } from "@/auth/providers/KeycloakProvider";

const keycloakProvider = new KeycloakProvider();

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const isRoot = (segments as string[]).length === 0;

    // If the user is authenticated and on the root index (auth screen), redirect them to tabs.
    if (isAuthenticated && isRoot) {
      router.replace("/(tabs)/explore");
    } 
    // If the user is NOT authenticated and trying to access an internal page, redirect them to index.
    else if (!isAuthenticated && !isRoot) {
      router.replace("/");
    }
  }, [isAuthenticated, segments]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider authService={keycloakProvider}>
      <RootLayoutNav />
    </AuthProvider>
  );
}
