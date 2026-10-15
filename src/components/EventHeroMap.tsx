import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing } from "@/constants/theme";
import {
  DEFAULT_REGION,
  fetchGpxRouteFromS3,
  regionFromCoordinates,
  type RouteData,
} from "@/utils/gpxRoute";

interface EventHeroMapProps {
  s3FileLocation?: string | null;
}

// Read-only route map for the event detail hero. Tap to open a full-screen,
// zoomable/pannable view of the route.
export function EventHeroMap({ s3FileLocation }: EventHeroMapProps) {
  const isDark = useColorScheme() === "dark";
  const colors = Colors[isDark ? "dark" : "light"];
  const primaryColor = isDark ? "#f59e0b" : "#d97706";
  const insets = useSafeAreaInsets();
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (!s3FileLocation || s3FileLocation === "null") return;
    let cancelled = false;
    fetchGpxRouteFromS3(s3FileLocation)
      .then((route) => {
        if (!cancelled) setRouteData(route);
      })
      .catch((err) => console.error("Error fetching GPX from S3:", err));
    return () => {
      cancelled = true;
    };
  }, [s3FileLocation]);

  const region = useMemo(
    () => regionFromCoordinates(routeData?.coordinates) ?? DEFAULT_REGION,
    [routeData],
  );

  // key remounts the map so it re-centres once the route loads
  const mapKey = routeData ? "route" : "default";

  return (
    <>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => setIsFullScreen(true)}
        accessibilityRole="button"
        accessibilityLabel="View route map full screen"
      >
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <MapView
            key={mapKey}
            style={StyleSheet.absoluteFill}
            mapType="mutedStandard"
            initialRegion={region}
            showsUserLocation={false}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            {routeData && (
              <Polyline
                coordinates={routeData.coordinates}
                strokeColor={primaryColor}
                strokeWidth={4}
                lineCap="round"
                lineJoin="round"
              />
            )}
          </MapView>
        </View>
        <View style={styles.expandOverlay}>
          <View
            style={[
              styles.iconButton,
              { backgroundColor: colors.backgroundElement },
            ]}
          >
            <Ionicons name="expand" size={20} color={colors.text} />
          </View>
        </View>
      </Pressable>

      <Modal
        visible={isFullScreen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setIsFullScreen(false)}
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <MapView
            key={mapKey}
            style={StyleSheet.absoluteFill}
            mapType="mutedStandard"
            initialRegion={region}
            showsUserLocation={false}
          >
            {routeData && (
              <Polyline
                coordinates={routeData.coordinates}
                strokeColor={primaryColor}
                strokeWidth={6}
                lineCap="round"
                lineJoin="round"
              />
            )}
          </MapView>
          <View
            style={[
              styles.topNav,
              { paddingTop: Math.max(insets.top, Spacing.three) },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.iconButton,
                styles.closeButton,
                { backgroundColor: colors.backgroundElement },
              ]}
              onPress={() => setIsFullScreen(false)}
              accessibilityLabel="Close map"
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  expandOverlay: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  topNav: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.three,
    zIndex: 10,
  },
});
