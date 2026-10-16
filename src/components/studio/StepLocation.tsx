import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MapView, { Polyline } from "react-native-maps";
import { searchPlaces, type PlaceResult } from "@/api/map/mapService";
import { useOrganizerTheme } from "@/constants/organizerTheme";
import type { StudioOption } from "@/data/studioMock";
import {
  DEFAULT_REGION,
  regionFromCoordinates,
  type RouteData,
} from "@/utils/gpxRoute";
import { FieldLabel } from "./FieldLabel";
import { FormSection } from "./FormSection";
import { SegmentedControl } from "./SegmentedControl";
import { TextField } from "./TextField";

export type LocationEventType = "IN_PERSON" | "VIRTUAL";

const EVENT_TYPE_OPTIONS: StudioOption<LocationEventType>[] = [
  { value: "IN_PERSON", label: "In-person", icon: "place" },
  { value: "VIRTUAL", label: "Virtual", icon: "videocam" },
];

interface StepLocationProps {
  eventType: LocationEventType;
  venue: PlaceResult | null;
  onEventTypeChange: (eventType: LocationEventType) => void;
  onVenueChange: (venue: PlaceResult) => void;
  route: RouteData | null;
  mapUploading?: boolean;
  mapError?: string | null;
  onMapPick: () => void;
}

export function StepLocation({
  eventType,
  venue,
  onEventTypeChange,
  onVenueChange,
  route,
  mapUploading,
  mapError,
  onMapPick,
}: StepLocationProps) {
  const t = useOrganizerTheme();
  const [searching, setSearching] = useState(!venue);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);

  // A venue arriving after mount (draft hydration) closes the search.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (venue) setSearching(false);
  }, [venue]);

  // Debounced Nominatim search.
  useEffect(() => {
    if (!searching || query.trim().length < 3) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(async () => {
      const found = await searchPlaces(query);
      if (cancelled) return;
      setResults(found);
      setLoading(false);
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, searching]);

  const choose = (place: PlaceResult) => {
    onVenueChange(place);
    setSearching(false);
    setQuery("");
    setResults([]);
  };

  return (
    <FormSection
      title="Location & Details"
      subtitle="Define where your event will happen."
    >
      <SegmentedControl
        options={EVENT_TYPE_OPTIONS}
        value={eventType}
        onChange={onEventTypeChange}
      />

      {eventType === "VIRTUAL" ? (
        <Text style={[styles.hint, { color: t.textMuted }]}>
          Virtual events don&apos;t need a venue. Attendees will join online.
        </Text>
      ) : (
        <>
          <FieldLabel label="Venue" required />
          <View
            style={[
              styles.card,
              { backgroundColor: t.surface, borderColor: t.border },
            ]}
          >
            <Pressable
              onPress={onMapPick}
              disabled={mapUploading}
              accessibilityLabel={route ? "Replace map" : "Upload map"}
              style={styles.map}
            >
              {route ? (
                <>
                  <MapView
                    style={StyleSheet.absoluteFill}
                    pointerEvents="none"
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    region={
                      regionFromCoordinates(route.coordinates) ?? DEFAULT_REGION
                    }
                  >
                    <Polyline
                      coordinates={route.coordinates}
                      strokeColor={t.primary}
                      strokeWidth={4}
                    />
                  </MapView>
                  <View style={[styles.chip, { backgroundColor: t.surface }]}>
                    <Text style={[styles.chipText, { color: t.primaryDark }]}>
                      Replace
                    </Text>
                  </View>
                </>
              ) : (
                <View
                  style={[
                    styles.upload,
                    { borderColor: t.primary, backgroundColor: t.primaryTint },
                  ]}
                >
                  <MaterialIcons
                    name="upload-file"
                    size={28}
                    color={t.primaryDark}
                  />
                  <Text style={[styles.name, { color: t.primaryDark }]}>
                    Click to upload map
                  </Text>
                  <Text style={[styles.address, { color: t.textMuted }]}>
                    GPX file
                  </Text>
                </View>
              )}
              {mapUploading ? (
                <View style={styles.overlay}>
                  <ActivityIndicator color={t.primaryDark} />
                </View>
              ) : null}
            </Pressable>
            {venue && !searching ? (
              <View style={styles.row}>
                <View
                  style={[styles.badge, { backgroundColor: t.primaryTint }]}
                >
                  <MaterialIcons name="place" size={22} color={t.primaryDark} />
                </View>
                <View style={styles.flex}>
                  <Text style={[styles.name, { color: t.text }]}>
                    {venue.name}
                  </Text>
                  {venue.address ? (
                    <Text style={[styles.address, { color: t.textMuted }]}>
                      {venue.address}
                    </Text>
                  ) : null}
                </View>
                <Pressable
                  onPress={() => setSearching(true)}
                  accessibilityLabel="Change venue"
                  hitSlop={8}
                >
                  <Text style={[styles.change, { color: t.primaryDark }]}>
                    Change
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.search}>
                <TextField
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search for a venue or address"
                  autoFocus={!!venue}
                  autoCorrect={false}
                />
                {loading ? (
                  <ActivityIndicator style={styles.spinner} color={t.primary} />
                ) : null}
                {results.map((r, i) => (
                  <Pressable
                    key={`${r.latitude},${r.longitude},${i}`}
                    onPress={() => choose(r)}
                    style={[
                      styles.result,
                      { backgroundColor: t.surface, borderColor: t.border },
                    ]}
                  >
                    <MaterialIcons
                      name="place"
                      size={20}
                      color={t.primaryDark}
                    />
                    <View style={styles.flex}>
                      <Text style={[styles.name, { color: t.text }]}>
                        {r.name}
                      </Text>
                      {r.address ? (
                        <Text
                          numberOfLines={2}
                          style={[styles.address, { color: t.textMuted }]}
                        >
                          {r.address}
                        </Text>
                      ) : null}
                    </View>
                  </Pressable>
                ))}
                {venue ? (
                  <Pressable onPress={() => setSearching(false)} hitSlop={8}>
                    <Text
                      style={[
                        styles.change,
                        styles.cancel,
                        { color: t.primaryDark },
                      ]}
                    >
                      Cancel
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            )}
          </View>
          {route ? (
            <View style={styles.statsGrid}>
              {[
                {
                  icon: "straighten",
                  label: "Distance",
                  value: `${route.distanceKm.toFixed(1)} km`,
                },
                {
                  icon: "trending-up",
                  label: "Elevation",
                  value: `${Math.ceil(route.elevationGainM)} m`,
                },
              ].map((stat) => (
                <View
                  key={stat.label}
                  style={[
                    styles.statBox,
                    { backgroundColor: t.surface, borderColor: t.border },
                  ]}
                >
                  <View
                    style={[
                      styles.iconWrapper,
                      { backgroundColor: t.primaryTint },
                    ]}
                  >
                    <MaterialIcons
                      name={stat.icon as keyof typeof MaterialIcons.glyphMap}
                      size={24}
                      color={t.primaryDark}
                    />
                  </View>
                  <Text style={[styles.statLabel, { color: t.textMuted }]}>
                    {stat.label}
                  </Text>
                  <Text style={[styles.statValue, { color: t.text }]}>
                    {stat.value}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
          {mapError ? (
            <Text style={[styles.hint, { color: t.danger }]}>{mapError}</Text>
          ) : null}
          <Text style={[styles.hint, { color: t.textMuted }]}>
            This address will be shown publicly on your event page.
          </Text>
        </>
      )}
    </FormSection>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hint: { fontSize: 15, marginTop: 8 },
  card: { borderWidth: 1, borderRadius: 16, overflow: "hidden" },
  map: { height: 150, width: "100%", padding: 12 },
  upload: {
    flex: 1,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  chip: {
    position: "absolute",
    right: 10,
    bottom: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statsGrid: { flexDirection: "row", gap: 12, marginTop: 12 },
  statBox: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statLabel: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: "bold" },
  chipText: { fontSize: 14, fontWeight: "700" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  search: { padding: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 17, fontWeight: "700" },
  address: { fontSize: 15, marginTop: 2 },
  change: { fontSize: 17, fontWeight: "700" },
  cancel: { marginTop: 12, alignSelf: "flex-start" },
  spinner: { marginTop: 12 },
  result: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
});
