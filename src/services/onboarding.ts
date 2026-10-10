import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export type OnboardingIntent = "attendee" | "organizer";

const STORAGE_KEY = "recpasshub_onboarding_intent";

/**
 * The choice made on the first-launch welcome screen, or null if it has not
 * been made yet (or storage is unavailable, which re-shows the welcome screen).
 */
export async function getOnboardingIntent(): Promise<OnboardingIntent | null> {
  try {
    let stored: string | null = null;
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        stored = localStorage.getItem(STORAGE_KEY);
      }
    } else {
      stored = await SecureStore.getItemAsync(STORAGE_KEY);
    }
    return stored === "attendee" || stored === "organizer" ? stored : null;
  } catch (err) {
    console.error("Failed to load onboarding intent", err);
    return null;
  }
}

export async function setOnboardingIntent(
  intent: OnboardingIntent,
): Promise<void> {
  try {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, intent);
      }
    } else {
      await SecureStore.setItemAsync(STORAGE_KEY, intent);
    }
  } catch (err) {
    console.error("Failed to save onboarding intent", err);
  }
}
