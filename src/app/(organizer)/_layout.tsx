import { Tabs, useRouter } from "expo-router";
import {
  useColorScheme,
  Pressable,
  View,
  Text,
  Modal,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { useEventContext } from "@/context/event-context";

export default function OrganizerLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { logout } = useAuth();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { events, selectedEvent, switchEvent, saveDraft, deleteEvent } =
    useEventContext();

  // Amber color from the design
  const primaryColor = isDark ? "#f59e0b" : "#d97706";
  const bgColor = isDark ? "#1e1e1e" : "#ffffff";
  const drawerBg = isDark ? "#1e1e1e" : "#f8f9ff";
  const textColor = isDark ? "#ffffff" : "#0b1c30";
  const textVariantColor = isDark ? "#a0a4ab" : "#554336";
  const outlineColor = isDark ? "#33353a" : "#dbc2b0";
  const errorColor = "#ba1a1a";

  const DrawerItem = ({
    title,
    subtitle,
    icon,
    color,
    active = false,
    onPress,
    onDelete,
  }: any) => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Pressable
        onPress={onPress}
        style={[
          styles.drawerItem,
          { flex: 1 },
          active && { backgroundColor: primaryColor + "20" },
        ]}
      >
        <MaterialIcons name={icon} size={24} color={color} />
        <View style={styles.drawerItemTextContainer}>
          <Text
            style={[
              styles.drawerItemTitle,
              { color },
              active && { fontWeight: "bold" },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.drawerItemSubtitle,
                { color: active ? color : textVariantColor },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </Pressable>
      {onDelete && (
        <Pressable onPress={onDelete} style={{ padding: 12, marginRight: 8 }}>
          <MaterialIcons name="delete-outline" size={20} color={errorColor} />
        </Pressable>
      )}
    </View>
  );

  return (
    <>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: primaryColor },
          headerTintColor: "#ffffff",
          headerTitleAlign: "center",
          headerTitleStyle: { fontWeight: "600" },
          tabBarActiveTintColor: primaryColor,
          tabBarStyle: { backgroundColor: bgColor },
          headerLeft: () => (
            <Pressable
              style={{ marginLeft: 16 }}
              onPress={() => setDrawerVisible(true)}
            >
              <MaterialIcons name="menu" size={24} color="#ffffff" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable style={{ marginRight: 16 }}>
              <MaterialIcons name="notifications" size={24} color="#ffffff" />
            </Pressable>
          ),
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Rec Pass Hub",
            tabBarLabel: "Dashboard",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="dashboard" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="edit"
          options={{
            title: "Edit Event",
            tabBarLabel: "Edit Event",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="edit-calendar" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            tabBarLabel: "Messages",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="chat" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="checkin"
          options={{
            title: "Check-in",
            tabBarLabel: "Check-in",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="qr-code-scanner" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="studio"
          options={{
            href: null,
            headerShown: false,
            tabBarStyle: { display: "none" },
          }}
        />
      </Tabs>

      {/* Drawer Overlay */}
      <Modal visible={drawerVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setDrawerVisible(false)}
          />
          <View style={[styles.drawerContainer, { backgroundColor: drawerBg }]}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.drawerHeader}>
                <Text style={[styles.drawerTitle, { color: primaryColor }]}>
                  Organizer Menu
                </Text>
                <Pressable
                  onPress={() => setDrawerVisible(false)}
                  style={styles.closeButton}
                >
                  <MaterialIcons name="close" size={24} color={textColor} />
                </Pressable>
              </View>

              <View style={styles.drawerSection}>
                <Text
                  style={[styles.sectionLabel, { color: textVariantColor }]}
                >
                  SWITCH EVENT
                </Text>
              </View>

              <ScrollView
                style={styles.drawerScroll}
                contentContainerStyle={{ paddingHorizontal: 8 }}
              >
                {events.map((event) => {
                  const isDraft = event.state === "DRAFT";
                  let icon = "calendar-today";
                  if (event.sportType?.toUpperCase() === "SWIMMING")
                    icon = "pool";
                  else if (event.sportType?.toUpperCase() === "RUNNING")
                    icon = "directions-run";
                  else if (event.sportType?.toUpperCase() === "CYCLING")
                    icon = "directions-bike";

                  return (
                    <DrawerItem
                      key={event.eventGuid}
                      title={
                        isDraft ? `${event.eventName} (Draft)` : event.eventName
                      }
                      subtitle={
                        event.startDateTime
                          ? new Date(event.startDateTime).toLocaleDateString()
                          : "TBD"
                      }
                      icon={icon}
                      color={
                        selectedEvent?.eventGuid === event.eventGuid
                          ? primaryColor
                          : isDraft
                            ? outlineColor
                            : textVariantColor
                      }
                      active={selectedEvent?.eventGuid === event.eventGuid}
                      onPress={() => {
                        if (event.state === "PUBLISHED") {
                          router.push("/dashboard");
                        } else {
                          router.push(`/studio?id=${event.eventGuid}`);
                        }
                        setDrawerVisible(false);
                        switchEvent(event.eventGuid!);
                      }}
                      onDelete={
                        isDraft
                          ? () => deleteEvent(event.eventGuid!)
                          : undefined
                      }
                    />
                  );
                })}
              </ScrollView>

              <View
                style={[styles.drawerFooter, { borderTopColor: outlineColor }]}
              >
                <DrawerItem
                  title="Create New Event"
                  icon="add-circle"
                  color={textVariantColor}
                  onPress={async () => {
                    const newDraftId = `draft-${Date.now()}`;
                    const savedEvent = await saveDraft({
                      eventGuid: newDraftId,
                      eventName: "Untitled Event",
                      state: "DRAFT",
                    });
                    setDrawerVisible(false);
                    const navId = savedEvent?.eventGuid || newDraftId;
                    router.push(`/studio?id=${navId}`);
                  }}
                />
                <DrawerItem
                  title="Organization Settings"
                  icon="settings"
                  color={textVariantColor}
                />

                <Pressable
                  style={[styles.drawerItem, { marginTop: 4 }]}
                  onPress={() => {
                    setDrawerVisible(false);
                    router.replace("/(tabs)/explore");
                    logout();
                  }}
                >
                  <MaterialIcons name="logout" size={24} color={errorColor} />
                  <View style={styles.drawerItemTextContainer}>
                    <Text
                      style={[styles.drawerItemTitle, { color: errorColor }]}
                    >
                      Log Out
                    </Text>
                  </View>
                </Pressable>
              </View>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start", // Slide out from the left
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  drawerContainer: {
    width: "80%",
    maxWidth: 320,
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 8,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  drawerSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  drawerScroll: {
    flex: 1,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    marginBottom: 4,
  },
  drawerItemTextContainer: {
    marginLeft: 16,
  },
  drawerItemTitle: {
    fontSize: 16,
  },
  drawerItemSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  drawerFooter: {
    borderTopWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
});
