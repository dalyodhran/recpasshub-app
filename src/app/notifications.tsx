import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Colors } from "@/constants/BoldBlueTheme";
import { styles } from "@/styles/notifications.styles";
import TopAppBar from "@/components/ui/TopAppBar";

// Mock data matching the UI from the web prototype
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    isUnread: true,
    icon: "chat",
    title: "New Message from Organizer",
    time: "2m ago",
    message:
      "The organizer of Golden Gate Sunrise 10K replied to your message regarding the gear check.",
  },
  {
    id: "2",
    isUnread: true,
    icon: "event-repeat",
    title: "Event Schedule Updated",
    time: "1h ago",
    message:
      "The start time for Marin Headlands Half has been moved up to 7:30 AM due to predicted weather.",
  },
  {
    id: "3",
    isUnread: false,
    icon: "explore",
    title: "Suggested for You",
    time: "Yesterday",
    message:
      "You might be interested in the upcoming Sausalito Trail Run based on your recent activity!",
  },
  {
    id: "4",
    isUnread: false,
    icon: "confirmation-number", // Mapping to material icons format
    title: "Pass Verified",
    time: "2 days ago",
    message:
      "Your entry pass for the Bay Area Cyclocross series has been successfully verified.",
  },
  {
    id: "5",
    isUnread: false,
    icon: "workspace-premium",
    title: "New Milestone Achieved",
    time: "Last Week",
    message:
      "Congratulations! You've attended 5 events this season. Keep up the great work.",
  },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header Area */}
      <View style={{ paddingTop: insets.top, backgroundColor: Colors.primary }}>
        <TopAppBar
          title="Notifications"
          showBackButton
          onBackPress={() => router.back()}
          hideNotificationIcon // Don't show the bell on the notifications screen itself
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_NOTIFICATIONS.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            style={styles.notificationCard}
            activeOpacity={0.7}
          >
            {/* Unread Accent Strip */}
            {notif.isUnread && <View style={styles.unreadIndicator} />}

            {/* Icon */}
            <View
              style={[
                styles.iconContainer,
                notif.isUnread ? styles.iconUnread : styles.iconRead,
              ]}
            >
              <MaterialIcons
                name={notif.icon as any}
                size={24}
                color={
                  notif.isUnread ? Colors.primary : Colors.onSurfaceVariant
                }
              />
            </View>

            {/* Text Content */}
            <View style={styles.textContent}>
              <View style={styles.headerRow}>
                <Text style={styles.titleText} numberOfLines={1}>
                  {notif.title}
                </Text>
                <Text
                  style={
                    notif.isUnread ? styles.timeTextUnread : styles.timeTextRead
                  }
                >
                  {notif.time}
                </Text>
              </View>
              <Text style={styles.messageText} numberOfLines={2}>
                {notif.message}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* End of list / Empty state indicator */}
        <View style={styles.emptyStateContainer}>
          <MaterialIcons
            name="done-all"
            size={32}
            color={Colors.onSurfaceVariant}
            style={{ opacity: 0.5 }}
          />
          <Text style={styles.emptyStateText}>You&apos;re all caught up!</Text>
        </View>
      </ScrollView>
    </View>
  );
}
