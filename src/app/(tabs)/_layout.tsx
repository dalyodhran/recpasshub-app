import { Tabs, useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/auth/AuthContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Guests can browse Explore; account tabs send them to login instead
  const requireAccount = (returnTo: "/mypass" | "/profile") => ({
    tabPress: (e: { preventDefault: () => void }) => {
      if (isAuthenticated) return;
      e.preventDefault();
      router.push({ pathname: "/login", params: { returnTo } });
    },
  });

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
            <MaterialIcons name="explore" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mypass"
        listeners={requireAccount("/mypass")}
        options={{
          title: "My Passes",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="confirmation-number" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        listeners={requireAccount("/profile")}
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
