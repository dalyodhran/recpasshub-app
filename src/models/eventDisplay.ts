import type { EventData } from "@/data/mockEvents";
import type { EventModel, SportType } from "@/models/event";

const SPORT_LABELS: Record<string, EventData["sport"]> = {
  CYCLING: "Cycling",
  RUNNING: "Running",
  SWIMMING: "Swimming",
};

export function formatSport(sportType?: SportType): EventData["sport"] {
  if (!sportType) return "Running";
  return SPORT_LABELS[sportType] ?? (sportType as EventData["sport"]);
}

export function formatDate(isoDateTime?: string): string {
  if (!isoDateTime) return "TBD";
  return new Date(isoDateTime).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatTime(isoDateTime?: string): string {
  if (!isoDateTime) return "TBD";
  return new Date(isoDateTime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDistance(distanceKm?: number): string {
  if (distanceKm == null) return "--";
  return `${distanceKm.toFixed(2)} km`;
}

// EventCard/EventDetailsScreen still expect the mock EventData shape; EventResponse has no
// organizer display name or image yet, so those render as placeholders until the backend adds them.
export function toEventData(event: EventModel): EventData {
  return {
    id: event.eventGuid ?? "",
    title: event.eventName,
    organizer: "Rec Pass Hub Organizer",
    sport: formatSport(event.sportType),
    date: formatDate(event.startDateTime),
    time: formatTime(event.startDateTime),
    distance: formatDistance(
      event.map?.distance != null ? event.map.distance / 1000 : undefined,
    ),
    imageUrl: "",
    s3FileLocation: event.map?.s3FileLocation,
    location: event.map?.location ?? "",
    elevation: event.map?.elevation
      ? `${Math.round(event.map.elevation)} m`
      : "",
    targetPace: "",
    capacity: event.capacity ? `0 / ${event.capacity}` : "",
    description: event.description ?? "",
    faqs: event.frequentlyAskedQuestions ?? [],
  };
}
