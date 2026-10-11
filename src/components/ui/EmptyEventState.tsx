import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEventContext } from "@/context/event-context";

export default function EmptyEventState({
  title = "No Events Yet",
  message = "Get started by creating your first sporting event to manage RSVPs, check-ins, and messages.",
  actionLabel = "Create Your First Event",
  actionIcon = "add",
  onAction,
  icon = "event-busy",
}: {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionIcon?: keyof typeof MaterialIcons.glyphMap;
  onAction?: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
}) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const router = useRouter();
  const { saveDraft } = useEventContext();

  const primaryColor = isDark ? "#f59e0b" : "#d97706";
  const bgColor = isDark ? "#121212" : "#f8f9ff";
  const surfaceColor = isDark ? "#1e1e1e" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#0b1c30";
  const textVariantColor = isDark ? "#a0a4ab" : "#554336";

  const handleCreateEvent = async () => {
    const newDraftId = `draft-${Date.now()}`;
    const savedEvent = await saveDraft({
      eventGuid: newDraftId,
      eventName: "Untitled Event",
      state: "DRAFT",
    });
    const navId = savedEvent?.eventGuid || newDraftId;
    router.push(`/studio?id=${navId}`);
  };

  const handleAction = onAction ?? handleCreateEvent;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.content}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: isDark ? "#332200" : "#ffedd5" },
          ]}
        >
          <MaterialIcons name={icon} size={48} color={primaryColor} />
        </View>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: textVariantColor }]}>
          {message}
        </Text>

        <Pressable
          style={[styles.button, { backgroundColor: primaryColor }]}
          onPress={handleAction}
        >
          <MaterialIcons
            name={actionIcon}
            size={20}
            color="#ffffff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: { maxWidth: 400, width: "100%", alignItems: "center" },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
  },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
});
