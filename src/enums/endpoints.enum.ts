export const ENDPOINT = {
  USER_ME: "api/v1/users/me",
  USER_REGISTER: "api/v1/users/registerUser",
  ORGANIZER_EVENTS: `api/v1/events`,
  ORGANIZER_EVENT_BY_ID: (eventId: string | number) =>
    `${ENDPOINT.ORGANIZER_EVENTS}/${eventId}`,
  EVENTS_NEARBY: `api/v1/events/nearby`,
  MAPS_FILE: "api/v1/maps",
  WAIVER_FILE: "api/v1/waivers",
} as const;
