import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  useGlobalSearchParams,
  usePathname,
  useRouter,
  useSegments,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/ui/animated-icon";
import { AuthProvider, useAuth } from "@/auth/AuthContext";
import { KeycloakProvider } from "@/auth/providers/KeycloakProvider";
import { isPublicRoute, postLoginRoute } from "@/auth/routes";
import { EventProvider } from "@/context/event-context";

const keycloakProvider = new KeycloakProvider();

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const segments = useSegments();
  const pathname = usePathname();
  const { returnTo } = useGlobalSearchParams<{ returnTo?: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Never make routing decisions while SecureStore is still restoring the session
    if (isLoading) return;

    const currentSegments = segments as string[];
    const onLoginScreen = currentSegments[0] === "login";

    // Signed in on the login screen: continue to where they were heading, or their home section
    if (isAuthenticated && onLoginScreen) {
      const destination = postLoginRoute(user, returnTo);
      console.log(
        user?.role === "ORGANIZER"
          ? "📍 [Router] Organizer session established. Redirecting to organizer section..."
          : "📍 [Router] Attendee session established. Redirecting to attendee section...",
      );
      router.replace(destination);
    }
    // Guests may browse public routes; anything else needs an account
    else if (!isAuthenticated && !isPublicRoute(currentSegments)) {
      console.log(
        "📍 [Router] Unauthenticated access to protected route. Redirecting to login screen...",
      );
      // Organizer routes open the login with the Organizer role preselected
      const role =
        currentSegments[0] === "(organizer)" ? { role: "organizer" } : {};
      router.replace({
        pathname: "/login",
        params: { returnTo: pathname, ...role },
      });
    }
  }, [isAuthenticated, isLoading, user, segments, pathname, returnTo, router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(organizer)" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider authService={keycloakProvider}>
      <EventProvider>
        <RootLayoutNav />
      </EventProvider>
    </AuthProvider>
  );
}
