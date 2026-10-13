import EventCard from "@/components/ui/EventCard";
import EmptyEventState from "@/components/ui/EmptyEventState";
import FilterChip from "@/components/ui/FilterChip";
import TopAppBar from "@/components/ui/TopAppBar";
import { Colors } from "@/constants/BoldBlueTheme";
import { styles } from "@/styles/explore.styles";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { loadNearbyEvents } from "@/api/event/eventService";
import { EventModel } from "@/models/event";
import { toEventData } from "@/models/eventDisplay";
import * as Location from "expo-location";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FILTERS = ["All Events", "Cycling", "Running", "Swimming"];
const DEFAULT_RADIUS_KM = 40;

type LocationPhase = "checking" | "undetermined" | "denied" | "granted";
type FetchStatus = "idle" | "loading" | "success" | "error";

// getCurrentPositionAsync throws "Cannot obtain current location" when the
// device has no fix (e.g. a simulator with no location set), so fall back to
// the last known position before giving up.
async function readPosition() {
  try {
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low,
    });
  } catch (err) {
    const lastKnown = await Location.getLastKnownPositionAsync();
    if (lastKnown) return lastKnown;
    throw err;
  }
}

export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = useState("All Events");
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [locationPhase, setLocationPhase] = useState<LocationPhase>("checking");
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [events, setEvents] = useState<EventModel[]>([]);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("idle");
  const [refreshing, setRefreshing] = useState(false);

  const checkPermission = useCallback(async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === Location.PermissionStatus.GRANTED) {
      try {
        const position = await readPosition();
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationPhase("granted");
      } catch (err) {
        console.error("Failed to read current position:", err);
        setLocationPhase("denied");
      }
    } else if (status === Location.PermissionStatus.DENIED) {
      setLocationPhase("denied");
    } else {
      setLocationPhase("undetermined");
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const requestPermission = useCallback(async () => {
    setLocationPhase("checking");
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === Location.PermissionStatus.GRANTED) {
        const position = await readPosition();
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationPhase("granted");
      } else {
        setLocationPhase("denied");
      }
    } catch (err) {
      console.error("Failed to request location permission:", err);
      setLocationPhase("denied");
    }
  }, []);

  const fetchEvents = useCallback(async (silent = false) => {
    if (!coords) return;
    if (!silent) setFetchStatus("loading");
    try {
      const nearbyEvents = await loadNearbyEvents(
        coords.latitude,
        coords.longitude,
        DEFAULT_RADIUS_KM,
      );
      setEvents(nearbyEvents);
      setFetchStatus("success");
    } catch (err) {
      console.error("Failed to load nearby events:", err);
      setFetchStatus("error");
    }
  }, [coords]);

  useEffect(() => {
    if (locationPhase === "granted" && coords) {
      fetchEvents();
    }
  }, [locationPhase, coords, fetchEvents]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents(true);
    setRefreshing(false);
  }, [fetchEvents]);

  const filteredEvents = events
    .map(toEventData)
    .filter(
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

        {locationPhase === "checking" && (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Getting your location...</Text>
          </View>
        )}

        {locationPhase === "undetermined" && (
          <View style={styles.stateContainer}>
            <View style={styles.stateIconCircle}>
              <MaterialIcons
                name="my-location"
                size={40}
                color={Colors.primary}
              />
            </View>
            <Text style={styles.stateTitle}>Find Events Near You</Text>
            <Text style={styles.stateMessage}>
              Rec Pass Hub uses your location to show sporting events within{" "}
              {DEFAULT_RADIUS_KM}km of you.
            </Text>
            <Pressable style={styles.stateButton} onPress={requestPermission}>
              <Text style={styles.stateButtonText}>Allow Location Access</Text>
            </Pressable>
          </View>
        )}

        {locationPhase === "denied" && (
          <View style={styles.stateContainer}>
            <View style={styles.stateIconCircle}>
              <MaterialIcons
                name="location-off"
                size={40}
                color={Colors.error}
              />
            </View>
            <Text style={styles.stateTitle}>Location Access Needed</Text>
            <Text style={styles.stateMessage}>
              We were unable to access your location. Enable it in your
              device settings to see events near you.
            </Text>
            <Pressable
              style={styles.stateButton}
              onPress={() => Linking.openSettings()}
            >
              <Text style={styles.stateButtonText}>Open Settings</Text>
            </Pressable>
            <Pressable
              style={styles.stateButtonSecondary}
              onPress={checkPermission}
            >
              <Text style={styles.stateButtonSecondaryText}>Try Again</Text>
            </Pressable>
          </View>
        )}

        {locationPhase === "granted" && fetchStatus === "loading" && (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Finding nearby events...</Text>
          </View>
        )}

        {locationPhase === "granted" && fetchStatus === "error" && (
          <View style={styles.stateContainer}>
            <View style={styles.stateIconCircle}>
              <MaterialIcons
                name="error-outline"
                size={40}
                color={Colors.error}
              />
            </View>
            <Text style={styles.stateTitle}>Something Went Wrong</Text>
            <Text style={styles.stateMessage}>
              We were unable to load nearby events. Check your connection and
              try again.
            </Text>
            <Pressable style={styles.stateButton} onPress={() => fetchEvents()}>
              <Text style={styles.stateButtonText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {locationPhase === "granted" &&
          fetchStatus === "success" &&
          filteredEvents.length === 0 && (
            <EmptyEventState
              icon="search-off"
              title="No Nearby Events"
              message={`We couldn't find any events within ${DEFAULT_RADIUS_KM}km of you right now. Try again later or check back soon.`}
              actionLabel="Retry Search"
              actionIcon="refresh"
              onAction={() => fetchEvents()}
            />
          )}

        {locationPhase === "granted" &&
          fetchStatus === "success" &&
          filteredEvents.length > 0 && (
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
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          )}
      </View>
    </View>
  );
}
