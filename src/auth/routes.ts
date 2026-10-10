import type { Href } from "expo-router";

import type { AuthUser } from "./types";

/**
 * Only allow in-app paths as a post-login destination, so a crafted
 * `returnTo` query param cannot bounce the user to an external URL.
 */
export function isSafeReturnPath(path: unknown): path is string {
  return (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.includes("://") &&
    !path.startsWith("/login")
  );
}

export function homeRouteFor(user: AuthUser | null): Href {
  return user?.role === "ORGANIZER"
    ? "/(organizer)/dashboard"
    : "/(tabs)/explore";
}

/**
 * Routes a signed-out visitor may browse. Everything else requires an account.
 */
export function isPublicRoute(segments: string[]): boolean {
  const [first, second] = segments;
  if (!first || first === "index" || first === "login") return true;
  if (first === "(tabs)") return !second || second === "explore";
  // Event detail only — checkout and messaging live deeper under /event
  if (first === "event") return segments.length === 2 && second === "[id]";
  return false;
}
