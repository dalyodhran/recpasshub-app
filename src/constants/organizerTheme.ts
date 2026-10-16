import { useColorScheme } from "react-native";

// Organizer-side palette (amber accent). Shared by Event Studio components.
const light = {
  primary: "#d97706",
  primaryDark: "#b45309",
  primaryTint: "#fffbeb",
  onPrimary: "#ffffff",
  background: "#f8fafc",
  surface: "#ffffff",
  text: "#0f172a",
  textMuted: "#64748b",
  placeholder: "#94a3b8",
  border: "#e2e8f0",
  track: "#e2e8f0",
  chip: "#e2e8f0",
  segment: "#eef2f7",
  danger: "#dc2626",
} as const;

const dark: Record<keyof typeof light, string> = {
  primary: "#f59e0b",
  primaryDark: "#fbbf24",
  primaryTint: "#2a2112",
  onPrimary: "#121212",
  background: "#121212",
  surface: "#1e1e1e",
  text: "#ffffff",
  textMuted: "#a0a4ab",
  placeholder: "#6b7280",
  border: "#33353a",
  track: "#33353a",
  chip: "#2a2c30",
  segment: "#2a2c30",
  danger: "#ef4444",
};

export type OrganizerTheme = Record<keyof typeof light, string>;

export function useOrganizerTheme(): OrganizerTheme & { isDark: boolean } {
  const isDark = useColorScheme() === "dark";
  return { ...(isDark ? dark : light), isDark };
}
