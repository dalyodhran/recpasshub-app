import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useOrganizerTheme } from "@/constants/organizerTheme";

interface StudioHeaderProps {
  title: string;
  onBack: () => void;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightPress?: () => void;
}

export function StudioHeader({
  title,
  onBack,
  rightIcon,
  onRightPress,
}: StudioHeaderProps) {
  const t = useOrganizerTheme();
  return (
    <View style={[styles.row, { backgroundColor: t.surface }]}>
      <Pressable onPress={onBack} hitSlop={8} accessibilityLabel="Go back">
        <MaterialIcons name="arrow-back" size={26} color={t.text} />
      </Pressable>
      <Text style={[styles.title, { color: t.text }]}>{title}</Text>
      {rightIcon ? (
        <Pressable
          onPress={onRightPress}
          hitSlop={8}
          accessibilityLabel="Save draft"
        >
          <MaterialIcons name={rightIcon} size={26} color={t.primary} />
        </Pressable>
      ) : (
        <View style={{ width: 26 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  title: { flex: 1, fontSize: 20, fontWeight: "700" },
});
