import React from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function DirectMessageReply() {
  const router = useRouter();
  const { id, name, avatar, initials } = useLocalSearchParams<{ id: string, name: string, avatar?: string, initials?: string }>();
  
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  
  const primaryColor = isDark ? "#f59e0b" : "#d97706";
  const bgColor = isDark ? "#121212" : "#f7f9fb";
  const surfaceColor = isDark ? "#1e1e1e" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#191c1e";
  const textVariantColor = isDark ? "#a0a4ab" : "#424754";
  const outlineColor = isDark ? "#33353a" : "#c2c6d6";
  const selfBubbleColor = primaryColor;
  const selfTextColor = "#ffffff";
  const otherBubbleColor = surfaceColor;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1, backgroundColor: bgColor }}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: primaryColor }]}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </Pressable>
        <View style={styles.headerProfile}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.headerAvatar} />
          ) : (
            <View style={[styles.headerInitials, { backgroundColor: surfaceColor }]}>
              <Text style={[styles.initialsText, { color: primaryColor }]}>{initials}</Text>
            </View>
          )}
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{name}</Text>
            <Text style={styles.headerId}>ID: MR-{id}94827</Text>
          </View>
        </View>
        <Pressable style={styles.headerBtn}>
          <MaterialIcons name="more-vert" size={24} color="#ffffff" />
        </Pressable>
      </View>

      {/* Chat Area */}
      <ScrollView contentContainerStyle={styles.chatContainer}>
        <View style={styles.dateMarkerContainer}>
          <View style={[styles.dateMarker, { backgroundColor: surfaceColor, borderColor: outlineColor }]}>
            <Text style={[styles.dateText, { color: textVariantColor }]}>Today</Text>
          </View>
        </View>

        {/* Incoming */}
        <View style={styles.incomingWrapper}>
          <View style={[styles.incomingBubble, { backgroundColor: otherBubbleColor, borderColor: outlineColor }]}>
            <Text style={[styles.bubbleText, { color: textColor }]}>
              Hey, what are the hours for the main pool this weekend? Also, do I need to bring my own towel?
            </Text>
          </View>
          <Text style={[styles.timeText, { color: textVariantColor }]}>10:42 AM</Text>
        </View>

        {/* Outgoing */}
        <View style={styles.outgoingWrapper}>
          <View style={[styles.outgoingBubble, { backgroundColor: selfBubbleColor }]}>
            <Text style={[styles.bubbleText, { color: selfTextColor }]}>
              Hi! The main pool is open from 8 AM to 8 PM this weekend. Towels are provided at the front desk, but you are welcome to bring your own. Let me know if you need anything else!
            </Text>
          </View>
          <View style={styles.timeRow}>
            <Text style={[styles.timeText, { color: textVariantColor, marginRight: 4 }]}>10:45 AM</Text>
            <MaterialIcons name="done-all" size={14} color={primaryColor} />
          </View>
        </View>

        {/* Incoming */}
        <View style={styles.incomingWrapper}>
          <View style={[styles.incomingBubble, { backgroundColor: otherBubbleColor, borderColor: outlineColor }]}>
            <Text style={[styles.bubbleText, { color: textColor }]}>
              Perfect, thanks. Is the sauna currently open? I heard it was under maintenance last week.
            </Text>
          </View>
          <Text style={[styles.timeText, { color: textVariantColor }]}>10:50 AM</Text>
        </View>
      </ScrollView>

      {/* Input Area */}
      <View style={[styles.inputContainer, { backgroundColor: surfaceColor, borderTopColor: outlineColor }]}>
        <Pressable style={styles.iconBtn}>
          <MaterialIcons name="add-circle" size={24} color={textVariantColor} />
        </Pressable>
        <View style={[styles.inputWrapper, { backgroundColor: bgColor, borderColor: outlineColor }]}>
          <TextInput 
            style={[styles.input, { color: textColor }]} 
            placeholder={`Message ${name}...`}
            placeholderTextColor={textVariantColor}
            multiline
          />
        </View>
        <Pressable style={[styles.sendBtn, { backgroundColor: primaryColor }]}>
          <MaterialIcons name="send" size={20} color="#ffffff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 48, // approx status bar
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerBtn: {
    padding: 8,
  },
  headerProfile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  headerInitials: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerText: {
    marginLeft: 12,
  },
  headerName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerId: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  dateMarkerContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  dateMarker: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "500",
  },
  incomingWrapper: {
    alignItems: "flex-start",
    marginBottom: 16,
    maxWidth: "80%",
  },
  incomingBubble: {
    padding: 14,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timeText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  outgoingWrapper: {
    alignItems: "flex-end",
    marginBottom: 16,
    maxWidth: "80%",
    alignSelf: "flex-end",
  },
  outgoingBubble: {
    padding: 14,
    borderRadius: 16,
    borderBottomRightRadius: 4,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginRight: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    paddingBottom: 32, // Safe area approximation
    borderTopWidth: 1,
  },
  iconBtn: {
    padding: 10,
    marginBottom: 2,
  },
  inputWrapper: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    marginBottom: 2,
  },
  input: {
    fontSize: 16,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
});
