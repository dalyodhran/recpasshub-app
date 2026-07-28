/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#1f2937",
    background: "#f5f5f5",
    backgroundElement: "#ffffff",
    backgroundSelected: "#e0e1e6",
    textSecondary: "#4a4a4a",
    primary: "#0056b3",
    primaryHover: "#004494",
    primaryContainer: "#d6e4ff",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#001849",
    surfaceVariant: "#f0f0f0",
    onSurfaceVariant: "#4a4a4a",
    outline: "#d1d5db",
    outlineVariant: "#e0e0e0",
  },
  dark: {
    text: "#ffffff",
    background: "#121212",
    backgroundElement: "#1e1e1e",
    backgroundSelected: "#2e3135",
    textSecondary: "#b0b4ba",
    primary: "#4796ff",
    primaryHover: "#3b82f6",
    primaryContainer: "#003178",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#d6e4ff",
    surfaceVariant: "#2a2c30",
    onSurfaceVariant: "#a0a4ab",
    outline: "#44474e",
    outlineVariant: "#33353a",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
