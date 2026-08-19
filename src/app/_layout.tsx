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
  const { isAuthenticated, isLoading, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Never make routing decisions while SecureStore is still restoring the session
    if (isLoading) return;

    const currentSegment = (segments as string[])[0];
    const inAuthGroup =
      currentSegment === "(tabs)" ||
      currentSegment === "(organizer)" ||
      currentSegment === "event" ||
      currentSegment === "pass" ||
      currentSegment === "notifications";
    const onLoginScreen =
      !currentSegment || currentSegment === "index" || currentSegment === "";

    // If authenticated and currently sitting on the login screen, jump directly to appropriate section
    if (isAuthenticated && onLoginScreen) {
      if (user?.role === "ORGANIZER") {
        console.log(
          "📍 [Router] Valid Organizer session detected. Redirecting to /(organizer)/dashboard...",
        );
        router.replace("/(organizer)/dashboard");
      } else {
        console.log(
          "📍 [Router] Valid Attendee session detected. Redirecting to /(tabs)/explore...",
        );
        router.replace("/(tabs)/explore");
      }
    }
    // If NOT authenticated and trying to access an internal protected page, send back to login.
    else if (!isAuthenticated && inAuthGroup) {
      console.log(
        "📍 [Router] Unauthenticated access attempt. Redirecting to login screen...",
      );
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, user, segments, router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(organizer)" />
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
