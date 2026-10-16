import {
  GenericAxiosService,
  AXIOS_METHOD,
} from "@/services/GenericAxiosService";
import { ENDPOINT } from "@/enums/endpoints.enum";

export interface MapsResponse {
  mapGuid: string;
  s3FileLocation: string;
  distance: number;
  elevation: number;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export async function uploadMapFile(
  token: string,
  fileUri: string,
  fileName: string,
  mimeType: string,
): Promise<MapsResponse> {
  const formData = new FormData();
  formData.append("file", {
    uri: fileUri,
    name: fileName,
    type: mimeType || "application/octet-stream",
  } as any);

  return GenericAxiosService<MapsResponse, FormData>({
    url: ENDPOINT.MAPS_FILE,
    method: AXIOS_METHOD.POST,
    payload: formData,
    token,
  });
}

export interface NominatimResponse {
  display_name?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    country?: string;
  };
}

export async function getCityFromCoordinates(
  lat: string,
  lon: string,
): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "recpasshub-app/1.0",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to reverse geocode coordinates");
    }

    const data: NominatimResponse = await response.json();

    if (data.address) {
      return (
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.county ||
        data.display_name ||
        `${lat},${lon}`
      );
    }

    return data.display_name || `${lat},${lon}`;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return `${lat},${lon}`;
  }
}

export interface PlaceResult {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface NominatimPlace {
  name?: string;
  display_name?: string;
  lat: string;
  lon: string;
}

// "City Aquatic Center, 123 Splash Way, ..." -> name + remaining address.
function toPlace(p: NominatimPlace): PlaceResult {
  const parts = (p.display_name ?? "").split(",").map((s) => s.trim());
  const name = p.name || parts[0] || "Selected location";
  return {
    name,
    address: parts.slice(1).join(", "),
    latitude: parseFloat(p.lat),
    longitude: parseFloat(p.lon),
  };
}

export async function searchPlaces(query: string): Promise<PlaceResult[]> {
  const q = query.trim();
  if (!q) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(q)}`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "recpasshub-app/1.0" },
    });
    if (!response.ok) throw new Error("Failed to search places");
    const data: NominatimPlace[] = await response.json();
    return data.map(toPlace);
  } catch (error) {
    console.error("Error searching places:", error);
    return [];
  }
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<PlaceResult | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&zoom=18&lat=${latitude}&lon=${longitude}`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "recpasshub-app/1.0" },
    });
    if (!response.ok) throw new Error("Failed to reverse geocode");
    const data: NominatimPlace = await response.json();
    if (!data.display_name) return null;
    return { ...toPlace(data), latitude, longitude };
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return null;
  }
}

export async function resolveDisplayLocation(
  rawLocation?: string,
): Promise<string> {
  let displayLocation = rawLocation || "";

  if (displayLocation && displayLocation.includes(",")) {
    const [lat, lon] = displayLocation.split(",").map((coord) => coord.trim());
    if (lat && lon) {
      displayLocation = await getCityFromCoordinates(lat, lon);
    }
  }

  return displayLocation;
}
