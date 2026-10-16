import { StyleSheet, Text, View } from "react-native";
import { useOrganizerTheme } from "@/constants/organizerTheme";

interface StepProgressProps {
  step: number;
  total: number;
  label: string;
}

export function StepProgress({ step, total, label }: StepProgressProps) {
  const t = useOrganizerTheme();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: t.surface, borderBottomColor: t.border },
      ]}
    >
      <View style={styles.labels}>
        <Text style={[styles.step, { color: t.primaryDark }]}>
          Step {step} of {total}
        </Text>
        <Text style={[styles.label, { color: t.textMuted }]}>{label}</Text>
      </View>
      <View style={styles.segments}>
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              { backgroundColor: i < step ? t.primary : t.track },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  step: { fontSize: 15, fontWeight: "600" },
  label: { fontSize: 15 },
  segments: { flexDirection: "row", gap: 8 },
  segment: { flex: 1, height: 4, borderRadius: 2 },
});
