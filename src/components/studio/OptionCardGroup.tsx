import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useOrganizerTheme } from "@/constants/organizerTheme";
import type { StudioOption } from "@/data/studioMock";

interface OptionCardGroupProps<T extends string> {
  options: StudioOption<T>[];
  value?: T;
  onChange: (value: T) => void;
}

export function OptionCardGroup<T extends string>({
  options,
  value,
  onChange,
}: OptionCardGroupProps<T>) {
  const t = useOrganizerTheme();
  return (
    <View style={styles.row}>
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[
              styles.card,
              {
                backgroundColor: selected ? t.primaryTint : t.surface,
                borderColor: selected ? t.primary : t.border,
                borderWidth: selected ? 2 : 1,
              },
            ]}
          >
            {o.icon && (
              <MaterialIcons
                name={o.icon as keyof typeof MaterialIcons.glyphMap}
                size={30}
                color={selected ? t.primaryDark : t.textMuted}
              />
            )}
            <Text
              style={[
                styles.label,
                { color: selected ? t.primaryDark : t.textMuted },
              ]}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12 },
  card: {
    flex: 1,
    height: 76,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  label: { fontSize: 16, fontWeight: "600" },
});
