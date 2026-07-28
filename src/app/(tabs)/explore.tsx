import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import TopAppBar from "@/components/TopAppBar";
import FilterChip from "@/components/FilterChip";
import EventCard from "@/components/EventCard";
import type { EventData } from "@/components/EventCard";
import { Colors } from "@/constants/BoldBlueTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "@/styles/explore.styles";

const MOCK_EVENTS: EventData[] = [
  {
    id: "1",
    title: "Dawn Patrol Tempo Ride",
    organizer: "Velo Club Vistas",
    sport: "Cycling",
    date: "Oct 12",
    time: "6:00 AM",
    distance: "45 mi",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmYi1NlwehRQ6ng1jkjyPdpliCLOV04dwqubXaXXnUMCfdAG9pQmee7vVXkgQ-6oCeEm6SRMRSxMuiVcULzSBm6B7LBBJfAQsFKJy1h5hX6C-OBxZ7au62mws0CfJjFy_bUXWm3EPM_rY8M0vYGxncr748CVWmuheL0KsgR8ft4ezFAA3LxXa14qTMFghqSxyo_ClLZRyB6Aaaln9b2BhDCWKMlmUbt67w0bSSgMb6piLnZIiWrqV1jw",
  },
  {
    id: "2",
    title: "Gold Gate Sunrise 10k",
    organizer: "City Striders",
    sport: "Running",
    date: "Oct 24",
    time: "6:00 AM",
    distance: "10 km",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCkj_r4KTzGQ276GtwblyHU1uDSlWLaODCLGFovt1w1r0YSCNJfOxp_OUtfoa1jTpZBZowJ9ufEVhNlvpTbuJ7cp0Wqh0rMIhCNQIhW2MNmX9ouriLN2djSDX-VsLpd_jxWpoq44KFmfMrhkaaceGGQPF4Jeo6vvYuq2SqwwGvGH_2oedmN2QwIwHafDPVTDTBU3wGuJYJRSg5HTRTcz3pZwQDrgGdxJqje3AYlgE2XIkvEQ1gJqmOcAw",
  },
  {
    id: "3",
    title: "Open Water Masters",
    organizer: "Aquatic Endurance",
    sport: "Swimming",
    date: "Oct 15",
    time: "5:30 PM",
    distance: "3 km",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBaG_aBaCEc5pI07eQ24G5ASNXOwezSdSMrzClbc8vNM8prDlWvDyzkEycw2KR2sOz9gyPUgyg6JZo2A6u3ooguBsZOarty0CWTBnbmADRaC3y55h0DDaQhCipqK6Ldxpb-udnJ-uFAdMTsSrxvlk2K26-JKITbfIcjrqchnRLEOSShxakBcRBXcOaqsQ-XVuveDT5a8x8HlB0EPkN7H_dqYJi7ouqa4CQRsB2iDXpZaM2tu614YfmQLg",
  },
];

const FILTERS = ["All Events", "Cycling", "Running", "Swimming"];

export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = useState("All Events");
  const insets = useSafeAreaInsets();

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
          renderItem={({ item }) => <EventCard event={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
