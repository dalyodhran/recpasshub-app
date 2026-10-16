import { Pressable, StyleSheet, Text, View } from "react-native";
import { useOrganizerTheme } from "@/constants/organizerTheme";
import type { StudioOption } from "@/data/studioMock";

interface SegmentedControlProps<T extends string> {
  options: StudioOption<T>[];
  value?: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const t = useOrganizerTheme();
  return (
    <View style={[styles.track, { backgroundColor: t.segment }]}>
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[
              styles.segment,
              selected && {
                backgroundColor: t.surface,
                borderColor: t.primary,
                borderWidth: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: selected ? t.primaryDark : t.textMuted },
                selected && { fontWeight: "700" },
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
  track: { flexDirection: "row", borderRadius: 14, padding: 3 },
  segment: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { fontSize: 17, fontWeight: "500" },
});
