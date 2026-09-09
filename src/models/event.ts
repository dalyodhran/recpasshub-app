export type SportType = "SWIMMING" | "RUNNING" | "CYCLING" | string;
export type EventType = "IN_PERSON" | "VIRTUAL" | string;
export type EventState = "DRAFT" | "PUBLISHED" | string;

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
  eventType?: EventType;
  startDateTime?: string; // ISO 8601 string for Instant
  endDateTime?: string;
  capacity?: number;
  description?: string;
  state?: EventState;
  frequentlyAskedQuestions?: FAQ[];
  createdAt?: string;
  updatedAt?: string;
  mapGuid?: string;
  map?: MapsModel;
}
