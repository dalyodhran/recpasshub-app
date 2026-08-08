import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/auth/AuthContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  
  const isOrganizer = user?.role === "ORGANIZER";
  const activeTintColor = isOrganizer 
    ? (colorScheme === "dark" ? "#f59e0b" : "#d97706") // Golden Amber for Organizer
    : (colorScheme === "dark" ? "#d0e1fb" : "#0058be"); // Blue for Attendee

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeTintColor,
      }}
      initialRouteName="explore"
    >
      {/* 
        NOTE: To conditionally hide tabs based on role in the future, you can set the `href` property:
        options={{ href: isOrganizer ? null : '/explore', ... }}
      */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="search" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mypass"
        options={{
          title: "My Pass",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="confirmation-number" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
