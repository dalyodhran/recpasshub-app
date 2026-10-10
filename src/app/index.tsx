import { Redirect } from "expo-router";

import { useAuth } from "@/auth/AuthContext";
import { homeRouteFor } from "@/auth/routes";

export default function Index() {
  const { isLoading, user } = useAuth();

  // Wait for session restore (and the web OAuth `?code=` exchange on `/`) before leaving this route
  if (isLoading) return null;

  return <Redirect href={homeRouteFor(user)} />;
}
