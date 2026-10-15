import { Platform } from "react-native";
import type { Region } from "react-native-maps";
import * as FileSystem from "expo-file-system/legacy";
import { parseGPXWithCustomParser } from "@we-gold/gpxjs";
import { DOMParser } from "xmldom-qsa";

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface RouteData {
  coordinates: Coordinate[];
  distanceKm: number;
  elevationGainM: number;
}

export const DEFAULT_REGION: Region = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const customDOMParser = (xmlString: string) => {
  return new DOMParser().parseFromString(xmlString, "text/xml");
};

// Haversine formula to calculate distance in km
export function calculateDistance(points: { lat: number; lon: number }[]) {
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
export function calculateElevationGain(points: { ele: number }[]) {
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

// Bounding box with a 1.2x margin; null when there are no valid coordinates.
export function regionFromCoordinates(
  coordinates: Coordinate[] | undefined | null,
): Region | null {
  if (!coordinates || coordinates.length === 0) return null;

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

  if (validCount === 0) return null;

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLon + maxLon) / 2,
    latitudeDelta: (maxLat - minLat) * 1.2 || 0.05,
    longitudeDelta: (maxLon - minLon) * 1.2 || 0.05,
  };
}

// Parses GPX text into route data; null if the file has no usable track.
export function parseGpxRoute(
  gpxContent: string,
  overrides?: { distanceKm?: number; elevationGainM?: number },
): RouteData | null {
  const [parsedFile, error] = parseGPXWithCustomParser(
    gpxContent,
    customDOMParser,
  );

  if (error || !parsedFile || parsedFile.tracks.length === 0) return null;

  const trackPoints = parsedFile.tracks[0].points as any[];
  if (!trackPoints || trackPoints.length === 0) return null;

  const coordinates: Coordinate[] = [];
  for (const p of trackPoints) {
    const lat = Number(p.latitude);
    const lon = Number(p.longitude);
    if (!isNaN(lat) && !isNaN(lon)) {
      coordinates.push({ latitude: lat, longitude: lon });
    }
  }

  const pointData = trackPoints.map((p: any) => ({
    lat: p.latitude,
    lon: p.longitude,
    ele: p.elevation || 0,
  }));

  return {
    coordinates,
    distanceKm: overrides?.distanceKm ?? calculateDistance(pointData),
    elevationGainM:
      overrides?.elevationGainM ?? calculateElevationGain(pointData),
  };
}

// Downloads a GPX file (s3:// is rewritten to LocalStack) and parses it.
export async function fetchGpxRouteFromS3(
  s3FileLocation: string,
  overrides?: { distanceKm?: number; elevationGainM?: number },
): Promise<RouteData | null> {
  let downloadUrl = s3FileLocation;

  if (s3FileLocation.startsWith("s3://")) {
    // LocalStack URL translation.
    // Note: If testing on a physical iOS device, replace 'localhost' with your computer's local IP (e.g. 192.168.1.X).
    const LOCALSTACK_HOST =
      Platform.OS === "android" ? "10.0.2.2:4566" : "localhost:4566";
    downloadUrl = s3FileLocation.replace("s3://", `http://${LOCALSTACK_HOST}/`);
  }

  // Append cache-busting timestamp
  downloadUrl = `${downloadUrl}${downloadUrl.includes("?") ? "&" : "?"}_t=${Date.now()}`;

  const filename = s3FileLocation.split("/").pop() || "temp.gpx";
  const localUri = `${FileSystem.documentDirectory}${filename}`;

  const { uri, status } = await FileSystem.downloadAsync(downloadUrl, localUri);

  if (status !== 200) {
    throw new Error(
      `Download failed with status: ${status}. Ensure bucket is public.`,
    );
  }

  const fileContent = await FileSystem.readAsStringAsync(uri);
  return parseGpxRoute(fileContent, overrides);
}
