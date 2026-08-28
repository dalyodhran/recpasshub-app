export const ENDPOINT = {
  USER_ME: "api/v1/users/me",
  USER_REGISTER: "api/v1/users/registerUser",
  ORGANIZER_EVENTS: `api/v1/organizers/events`,
  ORGANIZER_EVENT_BY_ID: (eventId: string | number) =>
    `api/v1/organizers/events/${eventId}`,
} as const;
