import React from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/BoldBlueTheme";
import { styles } from "@/styles/ExploreEventCard.styles";

import type { EventData } from "@/data/mockEvents";

const BADGES: Record<string, { bg: string; fg: string }> = {
  Running: { bg: Colors.runningBadge, fg: Colors.onRunningBadge },
  Cycling: { bg: Colors.cyclingBadge, fg: Colors.onCyclingBadge },
  Swimming: { bg: Colors.primaryFixed, fg: Colors.primary },
};

export default function ExploreEventCard({
  event,
  onPress,
}: {
  event: EventData;
  onPress?: () => void;
}) {
  const badge = BADGES[event.sport] ?? {
    bg: Colors.surfaceContainerHigh,
    fg: Colors.onSurfaceVariant,
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.photo}>
        {event.imageUrl ? (
          <Image source={{ uri: event.imageUrl }} style={styles.photoImage} />
        ) : (
          <>
            <MaterialIcons name="image" size={40} color={Colors.outline} />
            <Text style={styles.photoLabel}>Event photo</Text>
          </>
        )}
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.fg }]}>
            {event.sport.toUpperCase()}
          </Text>
        </View>
        {/* Visual only: there is no bookmark API yet. */}
        <Pressable style={styles.bookmark} hitSlop={8}>
          <MaterialIcons
            name="bookmark-border"
            size={22}
            color={Colors.onSurface}
          />
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{event.title}</Text>
        <View style={styles.metaRow}>
          <MaterialIcons
            name="calendar-today"
            size={18}
            color={Colors.onSurfaceVariant}
          />
          <Text style={styles.metaText}>
            {event.date} · {event.time}
          </Text>
        </View>
        {!!event.location && (
          <View style={styles.metaRow}>
            <MaterialIcons
              name="place"
              size={18}
              color={Colors.onSurfaceVariant}
            />
            <Text style={styles.metaText}>{event.location}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <View>
            <Text style={styles.fromLabel}>From</Text>
            {/* The events API has no price field yet. */}
            <Text style={styles.price}>--</Text>
          </View>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Get Pass</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
