import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/BoldBlueTheme";
import { styles } from "@/styles/EventCard.styles";

import type { EventData } from "@/data/mockEvents";

export default function EventCard({
  event,
  onPress,
}: {
  event: EventData;
  onPress?: () => void;
}) {
  const getBadgeStyle = (sport: string) => {
    switch (sport) {
      case "Cycling":
        return {
          backgroundColor: Colors.secondaryContainer,
          color: Colors.onSecondaryContainer,
        };
      case "Running":
        return {
          backgroundColor: Colors.tertiaryContainer,
          color: Colors.onTertiaryContainer,
        };
      case "Swimming":
        return { backgroundColor: Colors.primary, color: Colors.onPrimary };
      default:
        return {
          backgroundColor: Colors.surfaceContainerHigh,
          color: Colors.onSurfaceVariant,
        };
    }
  };

  const badgeStyle = getBadgeStyle(event.sport);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.headerRow}>
        <View style={styles.logoInfoRow}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: event.imageUrl }} style={styles.image} />
          </View>
          <View>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.organizer}>{event.organizer}</Text>
          </View>
        </View>
        <View
          style={[
            styles.badge,
            { backgroundColor: badgeStyle.backgroundColor },
          ]}
        >
          <Text style={[styles.badgeText, { color: badgeStyle.color }]}>
            {event.sport}
          </Text>
        </View>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailCol}>
          <Text style={styles.detailLabel}>DATE</Text>
          <View style={styles.detailValueRow}>
            <MaterialIcons
              name="calendar-today"
              size={16}
              color={Colors.onSurface}
            />
            <Text style={styles.detailValue}>{event.date}</Text>
          </View>
        </View>
        <View style={styles.detailCol}>
          <Text style={styles.detailLabel}>TIME</Text>
          <View style={styles.detailValueRow}>
            <MaterialIcons name="schedule" size={16} color={Colors.onSurface} />
            <Text style={styles.detailValue}>{event.time}</Text>
          </View>
        </View>
        <View style={styles.detailCol}>
          <Text style={styles.detailLabel}>DISTANCE</Text>
          <View style={styles.detailValueRow}>
            <MaterialIcons
              name="straighten"
              size={16}
              color={Colors.onSurface}
            />
            <Text style={styles.detailValue}>{event.distance}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
