import type { EventData } from "@/data/mockEvents";
import EventCard from "@/components/ui/EventCard";
import FilterChip from "@/components/ui/FilterChip";
import TopAppBar from "@/components/ui/TopAppBar";
import { Colors } from "@/constants/BoldBlueTheme";
import { styles } from "@/styles/explore.styles";
import { useState } from "react";
import { useRouter } from "expo-router";
import { MOCK_EVENTS } from "@/data/mockEvents";
import { FlatList, ScrollView, StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FILTERS = ["All Events", "Cycling", "Running", "Swimming"];

export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = useState("All Events");
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const filteredEvents = MOCK_EVENTS.filter(
    (event) => activeFilter === "All Events" || event.sport === activeFilter,
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <TopAppBar title="Rec Pass Hub" />

      <View style={styles.content}>
        <View style={styles.filtersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {FILTERS.map((filter) => (
              <FilterChip
                key={filter}
                label={filter}
                isActive={activeFilter === filter}
                onPress={() => setActiveFilter(filter)}
              />
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => router.push(`/event/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
