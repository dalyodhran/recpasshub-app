import {
  GenericAxiosService,
  AXIOS_METHOD,
} from "@/services/GenericAxiosService";
import { ENDPOINT } from "@/enums/endpoints.enum";
import { EventModel } from "@/models/event";

function mapBackendEvent(e: any): EventModel {
  if (!e) return e;
  if (e.about !== undefined) {
    e.description = e.about;
    delete e.about;
  }
  return e;
}

export async function loadOrganizerEvents(
  token: string,
): Promise<EventModel[]> {
  const events = await GenericAxiosService<EventModel[], void>({
    url: ENDPOINT.ORGANIZER_EVENTS,
    method: AXIOS_METHOD.GET,
    token,
  });
  return (events || []).map(mapBackendEvent);
}

export async function loadNearbyEvents(
  token: string,
  latitude: number,
  longitude: number,
  radiusKm: number,
): Promise<EventModel[]> {
  const events = await GenericAxiosService<EventModel[], void>({
    url: ENDPOINT.EVENTS_NEARBY,
    method: AXIOS_METHOD.GET,
    params: { latitude, longitude, radius: radiusKm },
    token,
  });
  return (events || []).map(mapBackendEvent);
}

export async function loadEventById(
  token: string,
  eventId: string | number,
): Promise<EventModel> {
  const event = await GenericAxiosService<EventModel, void>({
    url: ENDPOINT.ORGANIZER_EVENT_BY_ID(eventId),
    method: AXIOS_METHOD.GET,
    token,
  });
  return mapBackendEvent(event);
}

export async function createEvent(
  token: string,
  event: Partial<EventModel>,
): Promise<EventModel> {
  const newEvent = await GenericAxiosService<EventModel, Partial<EventModel>>({
    url: ENDPOINT.ORGANIZER_EVENTS,
    method: AXIOS_METHOD.POST,
    payload: event,
    token,
  });
  return mapBackendEvent(newEvent);
}

export async function updateEvent(
  token: string,
  eventId: string | number,
  event: Partial<EventModel>,
): Promise<EventModel> {
  // Ensure we don't accidentally send 'about' to the backend
  const payload: any = { ...event };
  if (payload.about !== undefined) {
    payload.description = payload.about;
    delete payload.about;
  }

  const updatedEvent = await GenericAxiosService<
    EventModel,
    Partial<EventModel>
  >({
    url: ENDPOINT.ORGANIZER_EVENT_BY_ID(eventId),
    method: AXIOS_METHOD.PUT,
    payload,
    token,
  });
  return mapBackendEvent(updatedEvent);
}

export async function deleteEvent(
  token: string,
  eventId: string | number,
): Promise<void> {
  return GenericAxiosService<void, void>({
    url: ENDPOINT.ORGANIZER_EVENT_BY_ID(eventId),
    method: AXIOS_METHOD.DELETE,
    token,
  });
}
