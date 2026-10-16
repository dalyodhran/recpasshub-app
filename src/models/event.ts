export type SportType = "SWIMMING" | "RUNNING" | "CYCLING" | string;
export type SwimmingTerrain = "POOL" | "LAKE" | "OCEAN";
export type RoadTerrain = "ROAD" | "Trail" | "BOTH";
export type CyclingTerrain = "ROAD" | "GRAVEL" | "BOTH";
export type TerrainType =
  | SwimmingTerrain
  | RoadTerrain
  | CyclingTerrain
  | string;

// Valid terrain values per sport (running and cycling share the same set).
export const TERRAIN_BY_SPORT = {
  SWIMMING: ["POOL", "LAKE", "OCEAN"],
  RUNNING: ["ROAD", "Trail", "BOTH"],
  CYCLING: ["ROAD", "GRAVEL", "BOTH"],
} as const satisfies Record<string, readonly TerrainType[]>;

export type EventType = "IN_PERSON" | "VIRTUAL" | string;
export type EventState = "DRAFT" | "PUBLISHED" | string;

export interface TagModel {
  name: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface MapsModel {
  mapGuid: string;
  s3FileLocation: string;
  distance: number;
  elevation: number;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventModel {
  eventGuid?: string;
  organizationGuid?: string;
  eventName: string;
  sportType?: SportType;
  terrainType?: TerrainType;
  eventType?: EventType;
  startDateTime?: string; // ISO 8601 string for Instant
  endDateTime?: string;
  capacity?: number;
  description?: string;
  tags?: TagModel[];
  state?: EventState;
  frequentlyAskedQuestions?: FAQ[];
  createdAt?: string;
  updatedAt?: string;
  mapGuid?: string;
  map?: MapsModel;
  logoGuid?: string;
  logo?: {
    logoGuid?: string;
    s3FileLocation?: string;
  };
  waiverGuid?: string;
  waiver?: {
    s3FileLocation?: string;
  };
  latitude?: number;
  longitude?: number;
}
