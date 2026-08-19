import { Tabs } from "expo-router";
import { useColorScheme, Pressable, View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function OrganizerLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  // Amber color from the design
  const primaryColor = isDark ? "#f59e0b" : "#d97706";
  const bgColor = isDark ? "#1e1e1e" : "#ffffff";

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: primaryColor },
        headerTintColor: "#ffffff",
        headerTitleAlign: "center",
        headerTitleStyle: { fontWeight: "600" },
        tabBarActiveTintColor: primaryColor,
        tabBarStyle: { backgroundColor: bgColor },
        headerLeft: () => (
          <Pressable style={{ marginLeft: 16 }}>
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
            <MaterialIcons name="person-add" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
