import React from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/auth/AuthContext";
import { Colors } from "@/constants/theme";

export default function OrganizerDashboard() {
  const { logout } = useAuth();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  // Amber color from the design
  const primaryColor = isDark ? "#f59e0b" : "#d97706";
  const bgColor = isDark ? "#121212" : "#f8f9ff";
  const surfaceColor = isDark ? "#1e1e1e" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#0b1c30";
  const textVariantColor = isDark ? "#a0a4ab" : "#554336";
  const outlineColor = isDark ? "#33353a" : "#dbc2b0";

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Active Event Info */}
      <View style={styles.section}>
        <Text style={[styles.eventTitle, { color: textColor }]}>
          Varsity Basketball Tryouts
        </Text>
        <View style={styles.timeRow}>
          <MaterialIcons name="schedule" size={16} color={textVariantColor} />
          <Text style={[styles.eventTime, { color: textVariantColor }]}>
            Today, 3:00 PM - 5:00 PM
          </Text>
        </View>
      </View>

      {/* Collected Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: surfaceColor, borderColor: outlineColor },
        ]}
      >
        <View style={styles.cardContent}>
          <Text style={[styles.cardLabel, { color: textVariantColor }]}>
            COLLECTED
          </Text>
          <Text style={[styles.cardValue, { color: textColor }]}>$350</Text>
          <Text style={styles.successText}>+12% from last event</Text>
        </View>
        <View
          style={[styles.iconBox, { backgroundColor: `${primaryColor}1A` }]}
        >
          <MaterialIcons name="payments" size={24} color={primaryColor} />
        </View>
      </View>

      {/* Two-Column Grid */}
      <View style={styles.gridContainer}>
        {/* RSVPs Card */}
        <View
          style={[
            styles.gridCard,
            { backgroundColor: surfaceColor, borderColor: outlineColor },
          ]}
        >
          <View style={styles.gridCardHeader}>
            <Text style={[styles.cardLabel, { color: textVariantColor }]}>
              RSVPS
            </Text>
            <MaterialIcons name="groups" size={20} color={primaryColor} />
          </View>
          <Text style={[styles.gridCardValue, { color: textColor }]}>45</Text>
          <Text style={[styles.cardSubValue, { color: textVariantColor }]}>
            Target: 50
          </Text>
        </View>

        {/* Waivers Card */}
        <View
          style={[
            styles.gridCard,
            { backgroundColor: surfaceColor, borderColor: outlineColor },
          ]}
        >
          <View style={styles.gridCardHeader}>
            <Text style={[styles.cardLabel, { color: textVariantColor }]}>
              WAIVERS
            </Text>
            <MaterialIcons name="description" size={20} color={primaryColor} />
          </View>
          <Text style={[styles.gridCardValue, { color: textColor }]}>38</Text>
          <Text style={styles.errorText}>7 missing</Text>
        </View>
      </View>

      {/* Attendees List */}
      <View
        style={[
          styles.listContainer,
          { backgroundColor: surfaceColor, borderColor: outlineColor },
        ]}
      >
        <View style={[styles.listHeader, { borderBottomColor: outlineColor }]}>
          <Text style={[styles.cardLabel, { color: textVariantColor }]}>
            ATTENDEES
          </Text>
          <Pressable>
            <Text style={[styles.viewAllText, { color: primaryColor }]}>
              View All
            </Text>
          </Pressable>
        </View>

        {/* List Item 1 */}
        <View style={[styles.listItem, { borderBottomColor: outlineColor }]}>
          <View style={styles.listItemLeft}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCv__t5APnvr74IMHvDig745lQeC0zulKQLp2BXUhAkwilYNNceGbq7Ni1cqEk9b8M8SrkVQVmJ8QjYT48idrIZEkxgVP8vHumAJIa5DN3yd9CriLx-eJurbGWJp9VUc7B2qYFFcqMIRFsf6CZwFtb2J-i4cY-lCevkIJyLkXdX7A7OcI62l5bbu-S2jxeBn9Bq6VC2AjIU-jig4PjG-6jMoALw3enkDMLoAh_XVRnM_bI6_5YNx9nAlg",
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={[styles.attendeeName, { color: textColor }]}>
                Marcus Johnson
              </Text>
              <Text style={[styles.attendeeId, { color: textVariantColor }]}>
                ID: RPC-8842
              </Text>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, styles.badgeSuccess]}>
                  <Text style={styles.badgeSuccessText}>PAYMENT MADE</Text>
                </View>
                <View style={[styles.badge, styles.badgeWarning]}>
                  <Text style={styles.badgeWarningText}>WAIVER SIGNED</Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={[styles.timeAgo, { color: textVariantColor }]}>
            Just now
          </Text>
        </View>

        {/* List Item 2 */}
        <View style={styles.listItem}>
          <View style={styles.listItemLeft}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmii8hmQWn5KRGJnmn-sj6Ij0HRS3CVObmLs7oIDcrzqyUOG0ZM0e6PHXX1-59wZnUFyFeTgbkJieVhSoPT7fuZTf4-iW5jtCheFgeXSZO3kMdqSCQRNAF9l90GAPHGGMGVqbSHTi26KV4NrdTZyK7Ic_OvTCLtUmKDYJB518EsLvOpLtHZtcGdr-EwnLBY-lX8f4sZYmIgTSzWzVyO-7peAdOXxYb89O6Kk731QS3WHd_0pPm_rCn5g",
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={[styles.attendeeName, { color: textColor }]}>
                Sarah Chen
              </Text>
              <Text style={[styles.attendeeId, { color: textVariantColor }]}>
                ID: RPC-1029
              </Text>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, styles.badgeSuccess]}>
                  <Text style={styles.badgeSuccessText}>PAYMENT MADE</Text>
                </View>
                <View style={[styles.badge, styles.badgeWarning]}>
                  <Text style={styles.badgeWarningText}>WAIVER SIGNED</Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={[styles.timeAgo, { color: textVariantColor }]}>
            2m ago
          </Text>
        </View>
      </View>

      {/* Temporary Logout Button for Testing */}
      <View style={{ padding: 16, alignItems: "center", marginBottom: 40 }}>
        <Pressable
          onPress={logout}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 24,
            backgroundColor: outlineColor,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: textColor, fontWeight: "bold" }}>Log Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  eventTime: {
    fontSize: 16,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: "bold",
  },
  cardSubValue: {
    fontSize: 12,
    marginTop: 4,
  },
  successText: {
    fontSize: 12,
    color: "#15803d",
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#ba1a1a",
    marginTop: 4,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  gridContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  gridCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  gridCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  gridCardValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  listContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 24,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
  },
  attendeeName: {
    fontSize: 16,
    fontWeight: "500",
  },
  attendeeId: {
    fontSize: 12,
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeSuccess: {
    backgroundColor: "#dcfce7",
  },
  badgeSuccessText: {
    color: "#15803d",
    fontSize: 10,
    fontWeight: "bold",
  },
  badgeWarning: {
    backgroundColor: "#fef3c7",
  },
  badgeWarningText: {
    color: "#b45309",
    fontSize: 10,
    fontWeight: "bold",
  },
  timeAgo: {
    fontSize: 12,
  },
});
