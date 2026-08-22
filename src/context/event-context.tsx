import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export interface AppEvent {
  id: string;
  title: string;
  subtitle: string;
  icon: any; // using string for MaterialIcons name, but typing as any or string
  dateStr: string;
  status?: "PUBLISHED" | "DRAFT";
  maxAttendees?: string;
  location?: string;
  description?: string;
  eventType?: string;
  requireWaiver?: boolean;
}

export const INITIAL_MOCK_EVENTS: AppEvent[] = [
  { id: "e1", title: "Summer League Finals", subtitle: "Aug 15 - 20", icon: "calendar-today", dateStr: "Aug 15 - 20, 3:00 PM - 5:00 PM", status: "PUBLISHED" },
  { id: "e2", title: "Golden Gate Sunrise 10K", subtitle: "Sep 02", icon: "calendar-today", dateStr: "Sep 02, 6:00 AM - 10:00 AM", status: "PUBLISHED" },
  { id: "e3", title: "Varsity Basketball Tryouts", subtitle: "Oct 12", icon: "calendar-today", dateStr: "Oct 12, 1:00 PM - 4:00 PM", status: "PUBLISHED" },
  { id: "e4", title: "City Park 5K", subtitle: "Nov 05", icon: "calendar-today", dateStr: "Nov 05, 8:00 AM - 11:00 AM", status: "PUBLISHED" },
];

interface EventContextType {
  events: AppEvent[];
  selectedEvent: AppEvent;
  switchEvent: (id: string) => Promise<void>;
  saveDraft: (eventData: Partial<AppEvent>) => void;
  publishEvent: (id: string) => void;
  deleteEvent: (id: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const STORAGE_KEY = "recpasshub_selected_event_id";
const EVENTS_STORAGE_KEY = "recpasshub_events_list";

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<AppEvent[]>(INITIAL_MOCK_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState<string>(INITIAL_MOCK_EVENTS[0].id);

  useEffect(() => {
    const loadState = async () => {
      try {
        let storedId: string | null = null;
        let storedEventsJson: string | null = null;
        
        if (Platform.OS === 'web') {
          if (typeof localStorage !== 'undefined') {
            storedId = localStorage.getItem(STORAGE_KEY);
            storedEventsJson = localStorage.getItem(EVENTS_STORAGE_KEY);
          }
        } else {
          storedId = await SecureStore.getItemAsync(STORAGE_KEY);
          storedEventsJson = await SecureStore.getItemAsync(EVENTS_STORAGE_KEY);
        }
        
        let loadedEvents = INITIAL_MOCK_EVENTS;
        if (storedEventsJson) {
          loadedEvents = JSON.parse(storedEventsJson);
          setEvents(loadedEvents);
        }

        if (storedId && loadedEvents.find(e => e.id === storedId)) {
          setSelectedEventId(storedId);
        }
      } catch (err) {
        console.error("Failed to load state", err);
      }
    };
    loadState();
  }, []);

  const persistEvents = async (newEvents: AppEvent[]) => {
    try {
      const json = JSON.stringify(newEvents);
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(EVENTS_STORAGE_KEY, json);
        }
      } else {
        await SecureStore.setItemAsync(EVENTS_STORAGE_KEY, json);
      }
    } catch (err) {
      console.error("Failed to save events list", err);
    }
  };

  const switchEvent = async (id: string) => {
    setSelectedEventId(id);
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, id);
        }
      } else {
        await SecureStore.setItemAsync(STORAGE_KEY, id);
      }
    } catch (err) {
      console.error("Failed to save selected event", err);
    }
  };

  const saveDraft = (eventData: Partial<AppEvent>) => {
    setEvents(prev => {
      const existingIdx = prev.findIndex(e => e.id === eventData.id);
      let newEvents;
      if (existingIdx >= 0) {
        newEvents = [...prev];
        newEvents[existingIdx] = { ...newEvents[existingIdx], ...eventData, status: "DRAFT" as const };
      } else {
        newEvents = [...prev, {
          id: eventData.id || `draft-${Date.now()}`,
          title: eventData.title || "Untitled Draft",
          subtitle: eventData.subtitle || "TBD",
          icon: eventData.icon || "calendar-today",
          dateStr: eventData.dateStr || "TBD",
          status: "DRAFT" as const,
          ...eventData
        }];
      }
      persistEvents(newEvents);
      return newEvents;
    });
  };

  const publishEvent = (id: string) => {
    setEvents(prev => {
      const newEvents = prev.map(e => e.id === id ? { ...e, status: "PUBLISHED" as const } : e);
      persistEvents(newEvents);
      return newEvents;
    });
    // Switch to it once published
    switchEvent(id);
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => {
      const newEvents = prev.filter(e => e.id !== id);
      persistEvents(newEvents);
      
      // If we just deleted the active event, fall back to the first available event
      if (selectedEventId === id && newEvents.length > 0) {
        switchEvent(newEvents[0].id);
      }
      return newEvents;
    });
  };

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0] || INITIAL_MOCK_EVENTS[0];

  return (
    <EventContext.Provider value={{
      events,
      selectedEvent,
      switchEvent,
      saveDraft,
      publishEvent,
      deleteEvent
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEventContext must be used within an EventProvider");
  return context;
};
