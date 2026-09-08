import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import MapView, { Polyline, Region } from "react-native-maps";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { parseGPXWithCustomParser } from "@we-gold/gpxjs";
import { DOMParser } from "xmldom-qsa";
import { useAuth } from "@/auth/AuthContext";
import { uploadMapFile } from "@/api/map/mapService";

import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface RouteData {
  coordinates: Coordinate[];
  distanceKm: number;
  elevationGainM: number;
}

const customDOMParser = (xmlString: string) => {
  return new DOMParser().parseFromString(xmlString, "text/xml");
};

// Haversine formula to calculate distance in km
function calculateDistance(points: { lat: number; lon: number }[]) {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const p1 = points[i - 1];
    const p2 = points[i];
    const R = 6371; // Earth's radius in km
    const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
    const dLon = ((p2.lon - p1.lon) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((p1.lat * Math.PI) / 180) *
        Math.cos((p2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += R * c;
  }
  return total;
}

// Calculate elevation gain in meters
function calculateElevationGain(points: { ele: number }[]) {
  let totalGain = 0;
  for (let i = 1; i < points.length; i++) {
    const prevEle = points[i - 1].ele;
    const currEle = points[i].ele;
    if (prevEle != null && currEle != null) {
      const diff = currEle - prevEle;
      if (diff > 0) totalGain += diff;
    }
  }
  return totalGain;
}

interface EventHeroScreenProps {
  onMapSave?: (
    mapGuid: string,
    distanceKm: number,
    elevationGainM: number,
  ) => void;
  initialRouteData?: RouteData | null;
  s3FileLocation?: string | null;
  s3DistanceKm?: number;
  s3ElevationGainM?: number;
}

export function EventHeroScreen({
  onMapSave,
  initialRouteData,
  s3FileLocation,
  s3DistanceKm,
  s3ElevationGainM,
}: EventHeroScreenProps) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];
  const primaryColor = isDark ? "#f59e0b" : "#d97706";
  const insets = useSafeAreaInsets();

  const inlineMapRef = useRef<MapView>(null);
  const fullScreenMapRef = useRef<MapView>(null);

  const [routeData, setRouteData] = useState<RouteData | null>(
    initialRouteData || null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { authService } = useAuth();
  const [selectedFile, setSelectedFile] = useState<{
    uri: string;
    name: string;
    mimeType: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Sync initialRouteData if it changes (e.g., from existing event data)
  useEffect(() => {
    if (initialRouteData) {
      setRouteData(initialRouteData);
    }
  }, [initialRouteData]);

  // Fetch GPX from S3 if provided and we don't have route data yet
  useEffect(() => {
    if (s3FileLocation && s3FileLocation !== "null" && !routeData) {
      const fetchS3File = async () => {
        setIsLoading(true);
        try {
          let downloadUrl = s3FileLocation;

          if (s3FileLocation.startsWith("s3://")) {
            // LocalStack URL translation.
            // Note: If testing on a physical iOS device, replace 'localhost' with your computer's local IP (e.g. 192.168.1.X).
            const LOCALSTACK_HOST =
              Platform.OS === "android" ? "10.0.2.2:4566" : "localhost:4566";
            downloadUrl = s3FileLocation.replace(
              "s3://",
              `http://${LOCALSTACK_HOST}/`,
            );
          }

          // Append cache-busting timestamp
          downloadUrl = `${downloadUrl}${downloadUrl.includes("?") ? "&" : "?"}_t=${Date.now()}`;

          const filename = s3FileLocation.split("/").pop() || "temp.gpx";
          const localUri = `${FileSystem.documentDirectory}${filename}`;

          const { uri, status } = await FileSystem.downloadAsync(
            downloadUrl,
            localUri,
          );

          if (status !== 200) {
            throw new Error(
              `Download failed with status: ${status}. Ensure bucket is public.`,
            );
          }

          const fileContent = await FileSystem.readAsStringAsync(uri);

          const [parsedFile, error] = parseGPXWithCustomParser(
            fileContent,
            customDOMParser,
          );

          if (error || !parsedFile || parsedFile.tracks.length === 0) {
            console.error("Failed to parse S3 GPX file.");
            return;
          }

          const trackPoints = parsedFile.tracks[0].points as any[];

          if (!trackPoints || trackPoints.length === 0) {
            return;
          }

          const coordinates: Coordinate[] = [];
          for (const p of trackPoints) {
            const lat = Number(p.latitude);
            const lon = Number(p.longitude);
            if (!isNaN(lat) && !isNaN(lon)) {
              coordinates.push({ latitude: lat, longitude: lon });
            }
          }

          // Map to the format expected by the calculation functions
          const pointData = trackPoints.map((p: any) => ({
            lat: p.latitude,
            lon: p.longitude,
            ele: p.elevation || 0,
          }));

          const distanceKm = s3DistanceKm ?? calculateDistance(pointData);
          const elevationGainM =
            s3ElevationGainM ?? calculateElevationGain(pointData);

          setRouteData({
            coordinates,
            distanceKm,
            elevationGainM,
          });

          // Calculate bounding box safely to avoid stack overflow and handle invalid points
          let minLat = Infinity;
          let maxLat = -Infinity;
          let minLon = Infinity;
          let maxLon = -Infinity;
          let validCount = 0;

          for (const c of coordinates) {
            const lat = Number(c.latitude);
            const lon = Number(c.longitude);
            if (!isNaN(lat) && !isNaN(lon)) {
              if (lat < minLat) minLat = lat;
              if (lat > maxLat) maxLat = lat;
              if (lon < minLon) minLon = lon;
              if (lon > maxLon) maxLon = lon;
              validCount++;
            }
          }

          if (validCount > 0) {
            const region: Region = {
              latitude: (minLat + maxLat) / 2,
              longitude: (minLon + maxLon) / 2,
              latitudeDelta: (maxLat - minLat) * 1.2 || 0.05,
              longitudeDelta: (maxLon - minLon) * 1.2 || 0.05,
            };

            // Animate map to the new region
            if (fullScreenMapRef.current) {
              fullScreenMapRef.current.animateToRegion(region, 1000);
            }
            if (inlineMapRef.current) {
              inlineMapRef.current.animateToRegion(region, 1000);
            }
          }
        } catch (err) {
          console.error("Error fetching GPX from S3:", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchS3File();
    }
  }, [s3FileLocation, s3DistanceKm, s3ElevationGainM]);

  // Default region (e.g., San Francisco) if no route is loaded
  const defaultRegion: Region = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const handleUploadGPX = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled || result.assets.length === 0) {
        return;
      }

      setIsLoading(true);
      const asset = result.assets[0];
      const fileUri = asset.uri;

      setSelectedFile({
        uri: fileUri,
        name: asset.name || "route.gpx",
        mimeType: asset.mimeType || "application/octet-stream",
      });

      // Read file content
      const fileContent = await FileSystem.readAsStringAsync(fileUri);

      // Parse GPX
      const [parsedFile, error] = parseGPXWithCustomParser(
        fileContent,
        customDOMParser,
      );

      if (error || !parsedFile || parsedFile.tracks.length === 0) {
        Alert.alert("Error", "Failed to parse the GPX file.");
        setIsLoading(false);
        return;
      }

      const trackPoints = parsedFile.tracks[0].points as any[];

      if (!trackPoints || trackPoints.length === 0) {
        Alert.alert("Error", "No route points found in GPX.");
        setIsLoading(false);
        return;
      }

      const coordinates: Coordinate[] = [];
      for (const p of trackPoints) {
        const lat = Number(p.latitude);
        const lon = Number(p.longitude);
        if (!isNaN(lat) && !isNaN(lon)) {
          coordinates.push({ latitude: lat, longitude: lon });
        }
      }

      // Map to the format expected by the calculation functions
      const pointData = trackPoints.map((p: any) => ({
        lat: p.latitude,
        lon: p.longitude,
        ele: p.elevation || 0,
      }));

      const distanceKm = calculateDistance(pointData);
      const elevationGainM = calculateElevationGain(pointData);

      setRouteData({
        coordinates,
        distanceKm,
        elevationGainM,
      });

      // Calculate bounding box safely
      let minLat = Infinity;
      let maxLat = -Infinity;
      let minLon = Infinity;
      let maxLon = -Infinity;
      let validCount = 0;

      for (const c of coordinates) {
        const lat = Number(c.latitude);
        const lon = Number(c.longitude);
        if (!isNaN(lat) && !isNaN(lon)) {
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
          if (lon < minLon) minLon = lon;
          if (lon > maxLon) maxLon = lon;
          validCount++;
        }
      }

      if (validCount > 0) {
        const region: Region = {
          latitude: (minLat + maxLat) / 2,
          longitude: (minLon + maxLon) / 2,
          latitudeDelta: (maxLat - minLat) * 1.2 || 0.05,
          longitudeDelta: (maxLon - minLon) * 1.2 || 0.05,
        };

        // Animate map to the new region
        if (fullScreenMapRef.current) {
          fullScreenMapRef.current.animateToRegion(region, 1000);
        }
        if (inlineMapRef.current) {
          inlineMapRef.current.animateToRegion(region, 1000);
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Error",
        "An unexpected error occurred while processing the file.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndReturn = async () => {
    if (selectedFile) {
      try {
        setIsUploading(true);
        const token = await authService.getAccessToken();
        if (token) {
          const response = await uploadMapFile(
            token,
            selectedFile.uri,
            selectedFile.name,
            selectedFile.mimeType,
          );
          if (onMapSave && routeData) {
            onMapSave(
              response.mapGuid,
              routeData.distanceKm,
              routeData.elevationGainM,
            );
          }
        }
      } catch (err) {
        console.error("Failed to upload map", err);
        Alert.alert("Error", "Failed to upload the map file.");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }
    setSelectedFile(null);
    setIsFullScreen(false);
  };

  const currentRegion = React.useMemo(() => {
    if (
      !routeData ||
      !routeData.coordinates ||
      routeData.coordinates.length === 0
    ) {
      return defaultRegion;
    }

    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLon = Infinity;
    let maxLon = -Infinity;
    let validCount = 0;

    for (const c of routeData.coordinates) {
      const lat = Number(c.latitude);
      const lon = Number(c.longitude);
      if (!isNaN(lat) && !isNaN(lon)) {
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
        validCount++;
      }
    }

    if (validCount === 0) {
      return defaultRegion;
    }

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLon + maxLon) / 2,
      latitudeDelta: (maxLat - minLat) * 1.2 || 0.05,
      longitudeDelta: (maxLon - minLon) * 1.2 || 0.05,
    };
  }, [routeData]);

  const inlineView = (
    <Pressable
      style={styles.inlineContainer}
      onPress={() => setIsFullScreen(true)}
    >
      <View pointerEvents="none" style={styles.mapAbsolute}>
        <MapView
          ref={inlineMapRef}
          style={styles.mapAbsolute}
          mapType="mutedStandard"
          initialRegion={currentRegion}
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
            styles.expandIconContainer,
            { backgroundColor: colors.backgroundElement },
          ]}
        >
          <Ionicons name="expand" size={20} color={colors.text} />
        </View>
      </View>
    </Pressable>
  );

  const fullScreenView = (
    <Modal
      visible={isFullScreen}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Map Layer */}
        <MapView
          ref={fullScreenMapRef}
          style={styles.mapAbsolute}
          mapType="mutedStandard"
          initialRegion={currentRegion}
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

        {/* Floating Top Navigation */}
        <View
          style={[
            styles.topNav,
            { paddingTop: Math.max(insets.top, Spacing.three) },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.backButton,
              { backgroundColor: colors.backgroundElement },
            ]}
            onPress={() => setIsFullScreen(false)}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.uploadButton,
              { backgroundColor: colors.backgroundElement },
            ]}
            onPress={handleUploadGPX}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={primaryColor} />
            ) : (
              <>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={colors.text}
                />
                <ThemedText style={[styles.uploadText, { color: colors.text }]}>
                  Upload GPX
                </ThemedText>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom Dashboard */}
        <View
          style={[
            styles.bottomSheet,
            {
              backgroundColor: colors.backgroundElement,
              paddingBottom: Math.max(insets.bottom, Spacing.four),
            },
          ]}
        >
          <View style={styles.dragHandle} />

          <ThemedText style={styles.title}>Route Preview</ThemedText>

          <View style={styles.metricsGrid}>
            <View
              style={[
                styles.metricCard,
                { backgroundColor: colors.background },
              ]}
            >
              <ThemedText
                style={[styles.metricLabel, { color: colors.textSecondary }]}
              >
                Distance
              </ThemedText>
              <ThemedText style={styles.metricValue}>
                {routeData ? `${routeData.distanceKm.toFixed(2)} km` : "--"}
              </ThemedText>
            </View>
            <View
              style={[
                styles.metricCard,
                { backgroundColor: colors.background },
              ]}
            >
              <ThemedText
                style={[styles.metricLabel, { color: colors.textSecondary }]}
              >
                Elevation Gain
              </ThemedText>
              <ThemedText style={styles.metricValue}>
                {routeData ? `${Math.round(routeData.elevationGainM)} m` : "--"}
              </ThemedText>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: primaryColor }]}
            onPress={handleSaveAndReturn}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <ThemedText style={[styles.ctaText, { color: colors.onPrimary }]}>
                Save & Return
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      {inlineView}
      {fullScreenView}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inlineContainer: {
    height: 300,
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  expandOverlay: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  expandIconContainer: {
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
  mapAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topNav: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    height: 44,
    borderRadius: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    gap: Spacing.one,
  },
  uploadText: {
    fontSize: 15,
    fontWeight: "600",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 10,
  },
  dragHandle: {
    width: 48,
    height: 6,
    backgroundColor: "#d1d5db", // gray-300
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: Spacing.four,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: Spacing.four,
    textAlign: "center",
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  metricCard: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: 16,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 14,
    marginBottom: Spacing.one,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  ctaButton: {
    width: "100%",
    paddingVertical: Spacing.three,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.two,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
