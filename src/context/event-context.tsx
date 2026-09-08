import {
  createEvent,
  deleteEvent as deleteEventApi,
  loadOrganizerEvents,
  updateEvent,
} from "@/api/event/eventService";
import { useAuth } from "@/auth/AuthContext";
import { EventModel } from "@/models/event";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";

interface EventContextType {
  events: EventModel[];
  selectedEvent: EventModel | null;
  switchEvent: (id: string | number) => Promise<void>;
  saveDraft: (
    eventData: Partial<EventModel>,
  ) => Promise<EventModel | undefined>;
  publishEvent: (id: string | number) => Promise<void>;
  deleteEvent: (id: string | number) => Promise<void>;
  updateEventDetails: (
    eventData: Partial<EventModel>,
  ) => Promise<EventModel | undefined>;
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const STORAGE_KEY = "recpasshub_selected_event_id";

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, authService } = useAuth();
  const [events, setEvents] = useState<EventModel[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<
    string | number | null
  >(null);

  const fetchEvents = useCallback(async () => {
    if (!user?.id) return;
    try {
      const token = await authService.getAccessToken();
      if (!token) return;
      const loadedEvents = await loadOrganizerEvents(token);
      setEvents(loadedEvents);
      if (loadedEvents.length > 0 && !selectedEventId) {
        switchEvent(loadedEvents[0].eventGuid!);
      }
    } catch (err) {
      console.error("Failed to load events from backend", err);
    }
  }, [user?.id, authService, selectedEventId]);

  useEffect(() => {
    const loadState = async () => {
      try {
        let storedId: string | null = null;
        if (Platform.OS === "web") {
          if (typeof localStorage !== "undefined") {
            storedId = localStorage.getItem(STORAGE_KEY);
          }
        } else {
          storedId = await SecureStore.getItemAsync(STORAGE_KEY);
        }

        if (storedId) {
          // If numeric string, convert to number
          const numId = Number(storedId);
          setSelectedEventId(isNaN(numId) ? storedId : numId);
        }
      } catch (err) {
        console.error("Failed to load selected event id", err);
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const switchEvent = async (id: string | number) => {
    setSelectedEventId(id);
    try {
      const idStr = id.toString();
      if (Platform.OS === "web") {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(STORAGE_KEY, idStr);
        }
      } else {
        await SecureStore.setItemAsync(STORAGE_KEY, idStr);
      }
    } catch (err) {
      console.error("Failed to save selected event", err);
    }
  };

  const saveDraft = async (
    eventData: Partial<EventModel>,
  ): Promise<EventModel | undefined> => {
    if (!user?.id) return;
    try {
      const token = await authService.getAccessToken();
      if (!token) return;

      const isExisting =
        eventData.eventGuid &&
        !eventData.eventGuid.toString().startsWith("draft-");
      let updatedEvent: EventModel;

      // Use string literals for enum-like fields to avoid missing enum imports
      const payload: any = {
        ...eventData,
        sportType: eventData.sportType || "RUNNING",
        eventType: eventData.eventType || "IN_PERSON",
        state: "DRAFT",
      };

      if (isExisting) {
        updatedEvent = await updateEvent(token, eventData.eventGuid!, payload);
      } else {
        delete payload.eventGuid; // Remove draft ID
        updatedEvent = await createEvent(token, payload);
      }

      await fetchEvents();
      if (!isExisting && updatedEvent.eventGuid) {
        await switchEvent(updatedEvent.eventGuid);
      }
      return updatedEvent;
    } catch (err) {
      console.error("Failed to save draft", err);
    }
  };

  const publishEvent = async (id: string | number) => {
    if (!user?.id) return;
    try {
      const token = await authService.getAccessToken();
      if (!token) return;

      const eventToPublish = events.find((e) => e.eventGuid === id);
      if (!eventToPublish) return;

      await updateEvent(token, id, {
        ...eventToPublish,
        state: "PUBLISHED",
      });
      await fetchEvents();
      await switchEvent(id);
    } catch (err) {
      console.error("Failed to publish event", err);
    }
  };

  const deleteEvent = async (id: string | number) => {
    if (!user?.id) return;
    try {
      const token = await authService.getAccessToken();
      if (!token) return;

      // If it's a new draft that hasn't been saved to backend, just remove locally (though we now save immediately)
      if (id.toString().startsWith("draft-")) {
        setEvents((prev) => prev.filter((e) => e.eventGuid !== id));
        return;
      }

      await deleteEventApi(token, id);
      await fetchEvents();

      if (selectedEventId === id && events.length > 1) {
        const otherEvent = events.find((e) => e.eventGuid !== id);
        if (otherEvent?.eventGuid) {
          await switchEvent(otherEvent.eventGuid);
        }
      }
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  const updateEventDetails = async (
    eventData: Partial<EventModel>,
  ): Promise<EventModel | undefined> => {
    if (!user?.id) return;
    try {
      const token = await authService.getAccessToken();
      if (!token) return;

      if (
        !eventData.eventGuid ||
        eventData.eventGuid.toString().startsWith("draft-")
      ) {
        console.error("Cannot update an event that hasn't been created yet");
        return;
      }

      // Keep the existing state or default to DRAFT if none
      const payload: any = {
        ...eventData,
        sportType: eventData.sportType || "RUNNING",
        eventType: eventData.eventType || "IN_PERSON",
        state: eventData.state || "DRAFT",
      };

      const updatedEvent = await updateEvent(
        token,
        eventData.eventGuid,
        payload,
      );
      await fetchEvents();
      return updatedEvent;
    } catch (err) {
      console.error("Failed to update event details", err);
    }
  };

  const selectedEvent =
    events.find((e) => e.eventGuid === selectedEventId) || events[0] || null;

  return (
    <EventContext.Provider
      value={{
        events,
        selectedEvent,
        switchEvent,
        saveDraft,
        publishEvent,
        deleteEvent,
        updateEventDetails,
        refreshEvents: fetchEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context)
    throw new Error("useEventContext must be used within an EventProvider");
  return context;
};
