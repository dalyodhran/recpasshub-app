import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const DUMMY_MESSAGES = [
  {
    id: "1",
    name: "Marcus Rodriguez",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoLRDBrFpZT5fMknF3pQPzhNNjDbQUkSL4-cYOe0u3InhS-IDqA8SBcjbJ7XVId5iWhxp3ibd-gex6v1nsYKuypaqv_5lvI4rQSYwxIbUFcJjrBf-1fvUjC_Z1IXkMdYA1Csopqq_hdZ64BT9gMdRYUZL2cyt8JMHv9IR8E-BOev0XwV7-B09FrQTODBGYqGd2nci7wXXkwzUtcrls9Q0MLylcobSpvO4qkUxgk94P2DbCTlmmImPq5g",
    initials: null,
    event: "Summer League Finals",
    time: "2m ago",
    text: "Is there parking available near the east gate? I'm running a bit late and need to drop off equipment.",
    unread: true,
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfDQim31vCcExYHt6R3mLkUcVB9-C_GIkEyQCjl7BRU5u042VA3nA6v9Yd07uV-AIZi0lQ4fQ7JtPazXdYJPRIxO8b-tngTpvQ-C8UZOBA-0XnxFaDbdMfThZ61Ym8RnpIFuInH9TXunMIwRb6Imuyux8o3s_L6NiD6wDicwOuDruZDp6HhRVcWTG-a8lpaxdztvNXGyUCC0WPFtPT95SQTgHA-OPe00LmtH6mMQt-lwEiynzI-4tTGA",
    initials: null,
    event: "Varsity Basketball Tryouts",
    time: "12m ago",
    text: "I forgot my digital pass, can someone verify my ID at the front desk? I have my driver's license.",
    unread: true,
  },
  {
    id: "3",
    name: "James Davis",
    avatar: null,
    initials: "JD",
    event: "Community Swim Meet",
    time: "1h ago",
    text: "Thanks for sending over the schedule. See you tomorrow at 8 AM.",
    unread: false,
  },
  {
    id: "4",
    name: "Coach Thompson",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsWHqo8YnmSURSssQUV8Iom-ZrU4EJiP4QhG-7BPRjpr3iOoWv3rZ7pKKA2rsLMC2fqyrYDJXW8YTyG1ftbyPx4ZfhONoN-dtujNUlNX4upAfDb8PVg2XBNLdt_m1_8zMIU60Ecwsr8K7AO0oLDna3SZZzCWjrK2GOqaoOQgJAyZIdJTqlxZ1dMF5H-3xo-cUWLG5dhj-2mdHROk3-JjS-0N8aKw-58dQlriq0f6a2XzkvJ4F4qaJ-jA",
    initials: null,
    event: "Staff Coordination",
    time: "Yesterday",
    text: "Please ensure all volunteers check in 30 minutes prior to the first game. The scanner is set up at the north entrance.",
    unread: false,
  },
  {
    id: "5",
    name: "Elena Patel",
    avatar: null,
    initials: "EP",
    event: "Summer League Finals",
    time: "Yesterday",
    text: "We need more wristbands at the VIP section. Can someone bring a box from the storage room?",
    unread: false,
  },
];

export default function Messages() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const primaryColor = isDark ? "#f59e0b" : "#d97706";
  const bgColor = isDark ? "#121212" : "#f8f9ff";
  const surfaceColor = isDark ? "#1e1e1e" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#0b1c30";
  const textVariantColor = isDark ? "#a0a4ab" : "#554336";
  const outlineColor = isDark ? "#33353a" : "#dbc2b0";
  const readBgColor = isDark ? "#1a1a1a" : "#f8f9ff"; 
  const unreadBgColor = surfaceColor;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Search Header */}
      <View style={[styles.headerContainer, { backgroundColor: bgColor }]}>
        <View style={[styles.searchBar, { backgroundColor: surfaceColor, borderColor: outlineColor }]}>
          <MaterialIcons name="search" size={20} color={textVariantColor} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search attendees or events..."
            placeholderTextColor={textVariantColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Message List */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {DUMMY_MESSAGES.map((msg) => (
          <Pressable
            key={msg.id}
            onPress={() => router.push({
              pathname: `/message/${msg.id}` as any,
              params: {
                name: msg.name,
                avatar: msg.avatar || "",
                initials: msg.initials || "",
              },
            })}
            style={({ pressed }) => [
              styles.messageItem,
              {
                backgroundColor: msg.unread ? unreadBgColor : readBgColor,
                borderColor: msg.unread ? outlineColor : "transparent",
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <View style={styles.avatarContainer}>
              {msg.avatar ? (
                <Image source={{ uri: msg.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.initialsAvatar, { backgroundColor: outlineColor }]}>
                  <Text style={[styles.initialsText, { color: textColor }]}>
                    {msg.initials}
                  </Text>
                </View>
              )}
              {msg.unread && (
                <View style={[styles.unreadDot, { backgroundColor: primaryColor, borderColor: surfaceColor }]} />
              )}
            </View>

            <View style={styles.messageContent}>
              <View style={styles.messageHeaderRow}>
                <Text
                  style={[
                    styles.userName,
                    { color: textColor },
                    !msg.unread && { opacity: 0.8 },
                  ]}
                >
                  {msg.name}
                </Text>
                <Text
                  style={[
                    styles.timestamp,
                    { color: msg.unread ? primaryColor : textVariantColor },
                  ]}
                >
                  {msg.time}
                </Text>
              </View>
              <Text style={[styles.eventName, { color: textVariantColor }]}>
                {msg.event}
              </Text>
              <Text
                numberOfLines={2}
                style={[
                  styles.messageText,
                  { color: msg.unread ? textVariantColor : outlineColor },
                  msg.unread && { fontWeight: "500" },
                ]}
              >
                {msg.text}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
    paddingTop: 24,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 24,
  },
  messageItem: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e5e7eb",
  },
  initialsAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  unreadDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  messageContent: {
    flex: 1,
    justifyContent: "center",
  },
  messageHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 12,
    fontWeight: "500",
  },
  eventName: {
    fontSize: 14,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
});
