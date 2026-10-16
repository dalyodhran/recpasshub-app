import { MaterialIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOrganizerTheme } from "@/constants/organizerTheme";

interface StudioFooterProps {
  primaryLabel: string;
  onPrimary: () => void;
  loading?: boolean;
  disabled?: boolean;
  showArrow?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export function StudioFooter({
  primaryLabel,
  onPrimary,
  loading,
  disabled,
  showArrow = true,
  icon = "arrow-forward",
  secondaryLabel,
  onSecondary,
}: StudioFooterProps) {
  const t = useOrganizerTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: t.surface,
          borderTopColor: t.border,
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      {secondaryLabel && (
        <Pressable
          onPress={onSecondary}
          style={[styles.secondary, { borderColor: t.border }]}
        >
          <Text style={[styles.secondaryText, { color: t.text }]}>
            {secondaryLabel}
          </Text>
        </Pressable>
      )}
      <Pressable
        onPress={onPrimary}
        disabled={disabled || loading}
        style={[
          styles.primary,
          { backgroundColor: t.primary, opacity: disabled ? 0.5 : 1 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={t.onPrimary} />
        ) : (
          <>
            <Text style={[styles.primaryText, { color: t.onPrimary }]}>
              {primaryLabel}
            </Text>
            {showArrow && (
              <MaterialIcons
                name={icon}
                size={22}
                color={t.onPrimary}
              />
            )}
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  primary: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryText: { fontSize: 18, fontWeight: "700" },
  secondary: {
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: { fontSize: 16, fontWeight: "600" },
});
