import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

import { useAuth } from "@/auth/AuthContext";
import { homeRouteFor } from "@/auth/routes";
import {
  getOnboardingIntent,
  type OnboardingIntent,
} from "@/services/onboarding";

export default function Index() {
  const { isLoading, isAuthenticated, user } = useAuth();
  // undefined while reading storage; null means the welcome choice has not been made
  const [intent, setIntent] = useState<OnboardingIntent | null | undefined>(
    undefined,
  );

  useEffect(() => {
    getOnboardingIntent().then(setIntent);
  }, []);

  // Wait for session restore (and the web OAuth `?code=` exchange on `/`) before leaving this route
  if (isLoading || intent === undefined) return null;

  if (isAuthenticated) return <Redirect href={homeRouteFor(user)} />;
  if (intent === null) return <Redirect href="/welcome" />;
  if (intent === "organizer") {
    return (
      <Redirect href={{ pathname: "/login", params: { role: "organizer" } }} />
    );
  }
  return <Redirect href="/(tabs)/explore" />;
}
