import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { setOnboardingIntent } from "@/services/onboarding";
import { welcomeStyles } from "@/styles/welcome.styles";

interface ChoiceCardProps {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  title: string;
  description: string;
  accentColor: string;
  onPress: () => void;
}

function ChoiceCard({
  icon,
  title,
  description,
  accentColor,
  onPress,
}: ChoiceCardProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        welcomeStyles.choiceCard,
        {
          backgroundColor: colors.backgroundElement,
          borderColor: accentColor,
        },
        pressed && welcomeStyles.choiceCardPressed,
      ]}
    >
      <View style={[welcomeStyles.choiceIcon, { backgroundColor: accentColor }]}>
        <MaterialIcons name={icon} size={28} color={colors.onPrimary} />
      </View>
      <View style={welcomeStyles.choiceText}>
        <ThemedText style={[welcomeStyles.choiceTitle, { color: colors.text }]}>
          {title}
        </ThemedText>
        <ThemedText
          style={[
            welcomeStyles.choiceDescription,
            { color: colors.textSecondary },
          ]}
        >
          {description}
        </ThemedText>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={accentColor} />
    </Pressable>
  );
}

export default function WelcomeScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleAttend = async () => {
    await setOnboardingIntent("attendee");
    router.replace("/(tabs)/explore");
  };

  const handleOrganize = async () => {
    await setOnboardingIntent("organizer");
    router.replace({ pathname: "/login", params: { role: "organizer" } });
  };

  return (
    <View
      style={[welcomeStyles.container, { backgroundColor: colors.background }]}
    >
      <View
        style={[
          welcomeStyles.topHeaderBanner,
          {
            backgroundColor: colors.primary,
            paddingTop: Math.max(insets.top, Spacing.three),
          },
        ]}
      >
        <ThemedText
          style={[welcomeStyles.topHeaderTitle, { color: colors.onPrimary }]}
        >
          Rec Pass Hub
        </ThemedText>
      </View>

      <ScrollView
        contentContainerStyle={[
          welcomeStyles.content,
          {
            paddingTop: Spacing.four,
            paddingBottom: Math.max(insets.bottom + Spacing.two, Spacing.four),
            paddingLeft: Math.max(insets.left, Spacing.four),
            paddingRight: Math.max(insets.right, Spacing.four),
          },
        ]}
      >
        <ThemedText style={[welcomeStyles.heading, { color: colors.text }]}>
          Welcome
        </ThemedText>
        <ThemedText
          style={[welcomeStyles.subheading, { color: colors.textSecondary }]}
        >
          How will you be using Rec Pass Hub?
        </ThemedText>

        <ChoiceCard
          icon="directions-run"
          title="I want to attend events"
          description="Browse local events, join, and keep your passes in one place."
          accentColor={colors.primary}
          onPress={handleAttend}
        />
        <ChoiceCard
          icon="event"
          title="I organize events"
          description="Sign in to create events, manage waivers, and check in attendees."
          accentColor={colors.organizer}
          onPress={handleOrganize}
        />

        <ThemedText
          style={[welcomeStyles.footnote, { color: colors.textSecondary }]}
        >
          You can switch between attendee and organizer sign-in at any time.
        </ThemedText>
      </ScrollView>
    </View>
  );
}
