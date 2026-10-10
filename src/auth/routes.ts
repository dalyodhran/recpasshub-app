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

// URL paths served by the (organizer) group, plus the organizer-only scanner
const ORGANIZER_PATHS = [
  "/dashboard",
  "/studio",
  "/edit",
  "/checkin",
  "/messages",
  "/scanner",
];

function isOrganizerPath(path: string): boolean {
  return ORGANIZER_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

/**
 * Where to go once a session exists. `returnTo` is honoured only when it
 * belongs to the signed-in user's side of the app, so an organizer who
 * started on an attendee screen still lands on the organizer dashboard.
 */
export function postLoginRoute(user: AuthUser | null, returnTo: unknown): Href {
  if (isSafeReturnPath(returnTo)) {
    const forOrganizer = isOrganizerPath(returnTo);
    if ((user?.role === "ORGANIZER") === forOrganizer) return returnTo as Href;
  }
  return homeRouteFor(user);
}

/**
 * Routes a signed-out visitor may browse. Everything else requires an account.
 */
export function isPublicRoute(segments: string[]): boolean {
  const [first, second] = segments;
  if (!first || first === "index" || first === "login" || first === "welcome")
    return true;
  if (first === "(tabs)") return !second || second === "explore";
  // Event detail only — checkout and messaging live deeper under /event
  if (first === "event") return segments.length === 2 && second === "[id]";
  return false;
}
