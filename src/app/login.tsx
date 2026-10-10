import { useState } from "react";
import { Pressable, ScrollView, View, useColorScheme } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  AuthCard,
  AuthDivider,
  AuthHeader,
  LabeledInput,
  PrimaryButton,
  SocialAuthButtons,
  RoleSwitcher,
  AuthRole,
} from "@/components/auth";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useAuth } from "@/auth/AuthContext";
import { authStyles } from "@/styles/auth.styles";

export default function UnifiedAuthScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  const { login, signup, isLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const cameAsOrganizer = params.role === "organizer";

  // Only an explicit tap is stored; otherwise follow the route param, so the
  // Organizer role (and its Keycloak client) holds even if params arrive late
  const [pickedRole, setPickedRole] = useState<AuthRole | null>(null);
  const role: AuthRole =
    pickedRole ?? (cameAsOrganizer ? "organizer" : "attendee");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const activePrimaryColor =
    role === "organizer"
      ? scheme === "dark" ? "#f59e0b" : "#d97706" // Golden Amber for Organizer
      : colors.primary; // Default Bold Blue for Attendee

  const headerTitleText = role === "organizer" ? "Rec Pass Hub: Organizer" : "Rec Pass Hub";
  const subtitleText =
    role === "organizer"
      ? "Sign in to manage your events."
      : "Sign in to join events and view your passes.";

  // Guests can dismiss login and keep browsing events
  const handleClose = () => {
    // Organizers who haven't signed in go back to the attend/organize choice
    if (cameAsOrganizer) {
      router.replace("/welcome");
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/explore");
    }
  };

  const handleContinue = async () => {
    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    setErrorMsg("");
    try {
      await login(email.trim(), role);
    } catch (err: any) {
      setErrorMsg(err?.message || "Authentication failed");
    }
  };

  const handleSocialAuth = async () => {
    setErrorMsg("");
    try {
      await login(undefined, role);
    } catch (err: any) {
      setErrorMsg(err?.message || "Authentication failed");
    }
  };

  const handleSignUp = async () => {
    setErrorMsg("");
    try {
      await signup(email.trim(), role);
    } catch (err: any) {
      setErrorMsg(err?.message || "Registration failed");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Top Dynamic Header Banner */}
      <View
        style={[
          authStyles.topHeaderBanner,
          {
            backgroundColor: activePrimaryColor,
            paddingTop: Math.max(insets.top, Spacing.three),
          },
        ]}
      >
        <ThemedText
          style={[authStyles.topHeaderTitle, { color: colors.onPrimary }]}
        >
          {headerTitleText}
        </ThemedText>
        <Pressable
          style={authStyles.closeButton}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Continue browsing"
          hitSlop={8}
        >
          <MaterialIcons name="close" size={24} color={colors.onPrimary} />
        </Pressable>
      </View>

      <ScrollView
        style={[authStyles.scrollView, { backgroundColor: colors.background }]}
        contentContainerStyle={[
          authStyles.centerContainer,
          {
            paddingTop: Spacing.four,
            paddingBottom: Math.max(insets.bottom + Spacing.two, Spacing.four),
            paddingLeft: Math.max(insets.left, Spacing.four),
            paddingRight: Math.max(insets.right, Spacing.four),
          },
        ]}
      >
        <AuthHeader title="Welcome Back" subtitle={subtitleText} />

        <AuthCard>
          <RoleSwitcher role={role} onRoleChange={setPickedRole} />

          <SocialAuthButtons
            onPressGoogle={handleSocialAuth}
            onPressApple={handleSocialAuth}
          />

          <AuthDivider label="or continue with email" />

          <View style={authStyles.formContainer}>
            {errorMsg ? (
              <ThemedText style={authStyles.errorText}>{errorMsg}</ThemedText>
            ) : null}

            <LabeledInput
              label="Email Address"
              iconName="envelope.fill"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <PrimaryButton
              label="Continue"
              onPress={handleContinue}
              isLoading={isLoading}
              primaryColor={activePrimaryColor}
            />
          </View>
        </AuthCard>

        {/* Don't have a profile? Sign up */}
        <View style={authStyles.footer}>
          <ThemedText
            style={[authStyles.footerText, { color: colors.textSecondary }]}
          >
            Don&apos;t have a profile?{" "}
            <ThemedText
              style={[authStyles.footerLink, { color: activePrimaryColor }]}
              onPress={handleSignUp}
            >
              Sign up
            </ThemedText>
          </ThemedText>
        </View>

        {/* Terms and Privacy Policy */}
        <View style={[authStyles.footer, { marginTop: Spacing.two }]}>
          <ThemedText
            style={[authStyles.footerText, { color: colors.textSecondary }]}
          >
            By continuing, you agree to our{" "}
            <ThemedText
              style={[authStyles.termsLink, { color: activePrimaryColor }]}
            >
              Terms
            </ThemedText>{" "}
            and{" "}
            <ThemedText
              style={[authStyles.termsLink, { color: activePrimaryColor }]}
            >
              Privacy Policy
            </ThemedText>
            .
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}
