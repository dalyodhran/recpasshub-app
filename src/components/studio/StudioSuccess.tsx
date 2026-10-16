import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import { useOrganizerTheme } from "@/constants/organizerTheme";

interface StudioSuccessProps {
  eventName: string;
  registrationLink?: string;
  onDashboard: () => void;
  onEventList: () => void;
}

export function StudioSuccess({
  eventName,
  registrationLink = "",
  onDashboard,
  onEventList,
}: StudioSuccessProps) {
  const t = useOrganizerTheme();
  const hasLink = registrationLink.length > 0;

  const handleShare = () => {
    if (hasLink) Share.share({ message: registrationLink });
  };

  return (
    <View style={[styles.container, { backgroundColor: t.background }]}>
      <View style={[styles.badgeOuter, { backgroundColor: t.primaryTint }]}>
        <View style={[styles.badgeInner, { backgroundColor: t.primary }]}>
          <MaterialIcons name="check" size={48} color={t.onPrimary} />
        </View>
      </View>
      <Text style={[styles.title, { color: t.text }]}>Event published</Text>
      <Text style={[styles.subtitle, { color: t.textMuted }]}>
        {eventName} is live. Attendees can now register, sign the waiver, and
        receive their pass.
      </Text>

      <View
        style={[
          styles.linkRow,
          { backgroundColor: t.surface, borderColor: t.border },
        ]}
      >
        <MaterialIcons name="link" size={24} color={t.textMuted} />
        <Text
          numberOfLines={1}
          style={[
            styles.linkText,
            { color: hasLink ? t.text : t.placeholder },
          ]}
        >
          {hasLink ? registrationLink : "Link coming soon"}
        </Text>
        <Pressable
          disabled={!hasLink}
          accessibilityLabel="Copy link"
          style={[
            styles.copy,
            { backgroundColor: t.chip, opacity: hasLink ? 1 : 0.5 },
          ]}
        >
          <MaterialIcons name="content-copy" size={20} color={t.text} />
          <Text style={[styles.copyText, { color: t.text }]}>Copy</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={onDashboard}
        style={[styles.btn, { backgroundColor: t.primary }]}
      >
        <MaterialIcons name="dashboard" size={22} color={t.onPrimary} />
        <Text style={[styles.btnText, { color: t.onPrimary }]}>
          View event dashboard
        </Text>
      </Pressable>
      <Pressable
        onPress={handleShare}
        disabled={!hasLink}
        style={[
          styles.btn,
          { backgroundColor: t.segment, opacity: hasLink ? 1 : 0.5 },
        ]}
      >
        <MaterialIcons name="share" size={22} color={t.text} />
        <Text style={[styles.btnText, { color: t.text }]}>
          Share registration link
        </Text>
      </Pressable>
      <Pressable onPress={onEventList} hitSlop={8} style={styles.back}>
        <Text style={[styles.backText, { color: t.primaryDark }]}>
          Back to event list
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  badgeOuter: {
    alignSelf: "center",
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  badgeInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 32, fontWeight: "800", textAlign: "center" },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 12,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 16,
    paddingLeft: 16,
    paddingRight: 8,
    height: 56,
    marginBottom: 4,
  },
  linkText: { flex: 1, fontSize: 17 },
  copy: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  copyText: { fontSize: 16, fontWeight: "600" },
  btn: {
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnText: { fontSize: 17, fontWeight: "700" },
  back: { alignSelf: "center", paddingVertical: 12 },
  backText: { fontSize: 17, fontWeight: "600" },
});
