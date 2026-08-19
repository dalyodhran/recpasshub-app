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

export default function EditEvent() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const primaryColor = isDark ? "#f59e0b" : "#d97706";
  const bgColor = isDark ? "#121212" : "#f8f9ff";
  const surfaceColor = isDark ? "#1e1e1e" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#0b1c30";
  const textVariantColor = isDark ? "#a0a4ab" : "#554336";
  const outlineColor = isDark ? "#33353a" : "#dbc2b0";

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1, backgroundColor: bgColor }}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf8m5wUoB0A8Q9LaO6eBZ0EXwzeEaa6JUEcFz7OnsubEYHZbyakvPz0Fcvusaxif6_Adw-kjNghmBruHe7vnVwidwHvItjrfQL_hKp4kmOByv14MBJxPWTl48oh4QqgOmuTexeCNI5KqHuO_HEevnyBfdXY6GxUISmHlqutptQv4CZFVwQvdL7IA8V3l6wimaGRK-3TbSjxpVozNUc7hfYZDlkeTUCUUNq_jej29WZe8fTxWOMMVjj8w" }} 
            style={styles.heroImage} 
          />
        </View>

        <View style={styles.contentContainer}>
          {/* Event Header */}
          <View style={[styles.headerCard, { backgroundColor: surfaceColor, borderColor: outlineColor }]}>
            <View style={[styles.badge, { backgroundColor: primaryColor }]}>
              <Text style={styles.badgeText}>RUNNING</Text>
            </View>
            <TextInput 
              style={[styles.titleInput, { color: textColor, borderColor: outlineColor, backgroundColor: bgColor }]}
              defaultValue="Golden Gate Sunrise 10K"
            />
            
            <View style={styles.inputRow}>
              <MaterialIcons name="calendar-month" size={20} color={textVariantColor} />
              <TextInput 
                style={[styles.rowInput, { color: textVariantColor, borderColor: outlineColor, backgroundColor: bgColor }]}
                defaultValue="Saturday, Oct 24 • 6:00 AM"
              />
            </View>

            <View style={styles.inputRow}>
              <MaterialIcons name="location-on" size={20} color={textVariantColor} />
              <TextInput 
                style={[styles.rowInput, { color: textVariantColor, borderColor: outlineColor, backgroundColor: bgColor }]}
                defaultValue="Crissy Field, San Francisco"
              />
            </View>
          </View>

          {/* Stats Grid */}
          <Text style={[styles.sectionTitle, { color: textColor }]}>Event Details</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: surfaceColor, borderColor: outlineColor }]}>
              <View style={[styles.iconWrapper, { backgroundColor: `${primaryColor}1A` }]}>
                <MaterialIcons name="straighten" size={24} color={primaryColor} />
              </View>
              <Text style={[styles.statLabel, { color: textVariantColor }]}>Distance</Text>
              <Text style={[styles.statValue, { color: textColor }]}>10.0 km</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: surfaceColor, borderColor: outlineColor }]}>
              <View style={[styles.iconWrapper, { backgroundColor: `${primaryColor}1A` }]}>
                <MaterialIcons name="trending-up" size={24} color={primaryColor} />
              </View>
              <Text style={[styles.statLabel, { color: textVariantColor }]}>Elevation</Text>
              <Text style={[styles.statValue, { color: textColor }]}>45 m</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: surfaceColor, borderColor: outlineColor }]}>
              <View style={[styles.iconWrapper, { backgroundColor: `${primaryColor}1A` }]}>
                <MaterialIcons name="timer" size={24} color={primaryColor} />
              </View>
              <Text style={[styles.statLabel, { color: textVariantColor }]}>Target Pace</Text>
              <Text style={[styles.statValue, { color: textColor }]}>5:30/km</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: surfaceColor, borderColor: outlineColor }]}>
              <View style={[styles.iconWrapper, { backgroundColor: `${primaryColor}1A` }]}>
                <MaterialIcons name="group" size={24} color={primaryColor} />
              </View>
              <Text style={[styles.statLabel, { color: textVariantColor }]}>Capacity</Text>
              <Text style={[styles.statValue, { color: textColor }]}>50 / 100</Text>
            </View>
          </View>

          {/* About */}
          <Text style={[styles.sectionTitle, { color: textColor }]}>About</Text>
          <TextInput 
            style={[styles.textArea, { color: textVariantColor, borderColor: outlineColor, backgroundColor: surfaceColor }]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            defaultValue="Join us for an invigorating morning run starting at Crissy Field, tracing the coastline with spectacular views of the Golden Gate Bridge as the sun rises. Suitable for intermediate runners aiming for a steady pace. Water stations provided at the halfway mark."
          />

          {/* FAQs */}
          <Text style={[styles.sectionTitle, { color: textColor, marginTop: 24 }]}>FAQs</Text>
          <View style={[styles.faqContainer, { backgroundColor: surfaceColor, borderColor: outlineColor }]}>
            <View style={[styles.faqItem, { borderBottomColor: outlineColor }]}>
              <TextInput 
                style={[styles.faqQuestion, { color: textColor, borderColor: outlineColor, backgroundColor: bgColor }]}
                defaultValue="Is there bag drop available?"
              />
              <TextInput 
                style={[styles.faqAnswer, { color: textVariantColor, borderColor: outlineColor, backgroundColor: bgColor }]}
                multiline
                defaultValue="Yes, a secure bag drop will be available near the starting line from 5:30 AM."
              />
            </View>
            <View style={[styles.faqItem, { borderBottomWidth: 0 }]}>
              <TextInput 
                style={[styles.faqQuestion, { color: textColor, borderColor: outlineColor, backgroundColor: bgColor }]}
                defaultValue="What is the cancellation policy?"
              />
              <TextInput 
                style={[styles.faqAnswer, { color: textVariantColor, borderColor: outlineColor, backgroundColor: bgColor }]}
                multiline
                defaultValue="Full refunds are available up to 48 hours before the event start time. No refunds thereafter."
              />
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={[styles.bottomBar, { backgroundColor: surfaceColor, borderTopColor: outlineColor }]}>
        <Pressable style={[styles.saveBtn, { backgroundColor: primaryColor }]}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    height: 300,
    width: "100%",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 16,
    marginTop: -32,
  },
  headerCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rowInput: {
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statBox: {
    width: "48%",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 16,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
  },
  faqContainer: {
    borderRadius: 12,
    borderWidth: 1,
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "bold",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  faqAnswer: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 80,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32, // safe area approximation
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  saveBtn: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  }
});
