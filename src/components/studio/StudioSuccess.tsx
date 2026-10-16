import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useOrganizerTheme } from "@/constants/organizerTheme";

interface StudioSuccessProps {
  onDashboard: () => void;
  onEventList: () => void;
}

export function StudioSuccess({
  onDashboard,
  onEventList,
}: StudioSuccessProps) {
  const t = useOrganizerTheme();
  return (
    <View style={[styles.container, { backgroundColor: t.background }]}>
      <View
        style={[
          styles.card,
          { backgroundColor: t.surface, borderColor: t.border },
        ]}
      >
        <MaterialIcons name="check-circle" size={56} color={t.primary} />
        <Text style={[styles.title, { color: t.text }]}>
          Event Published Successfully!
        </Text>
        <Text style={[styles.subtitle, { color: t.textMuted }]}>
          Your event is live and ready for attendees.
        </Text>
        <Pressable
          onPress={onDashboard}
          style={[styles.btn, { backgroundColor: t.primary }]}
        >
          <Text style={[styles.btnText, { color: t.onPrimary }]}>
            View Event Dashboard
          </Text>
        </Pressable>
        <Pressable
          onPress={onEventList}
          style={[styles.btn, { backgroundColor: t.segment }]}
        >
          <Text style={[styles.btnText, { color: t.text }]}>
            Back to Event List
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  title: { fontSize: 24, fontWeight: "800", textAlign: "center" },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 8 },
  btn: {
    alignSelf: "stretch",
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { fontSize: 17, fontWeight: "700" },
});
