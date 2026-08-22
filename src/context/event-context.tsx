import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export interface AppEvent {
  id: string;
  title: string;
  subtitle: string;
  icon: any; // using string for MaterialIcons name, but typing as any or string
  dateStr: string;
}

export const MOCK_EVENTS: AppEvent[] = [
  { id: "e1", title: "Summer League Finals", subtitle: "Aug 15 - 20", icon: "calendar-today", dateStr: "Aug 15 - 20, 3:00 PM - 5:00 PM" },
  { id: "e2", title: "Golden Gate Sunrise 10K", subtitle: "Sep 02", icon: "calendar-today", dateStr: "Sep 02, 6:00 AM - 10:00 AM" },
  { id: "e3", title: "Varsity Basketball Tryouts", subtitle: "Oct 12", icon: "calendar-today", dateStr: "Oct 12, 1:00 PM - 4:00 PM" },
  { id: "e4", title: "City Park 5K", subtitle: "Nov 05", icon: "calendar-today", dateStr: "Nov 05, 8:00 AM - 11:00 AM" },
];

interface EventContextType {
  events: AppEvent[];
  selectedEvent: AppEvent;
  switchEvent: (id: string) => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const STORAGE_KEY = "recpasshub_selected_event_id";

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(MOCK_EVENTS[0].id);

  useEffect(() => {
    const loadSelectedEvent = async () => {
      try {
        let storedId: string | null = null;
        if (Platform.OS === 'web') {
          if (typeof localStorage !== 'undefined') {
            storedId = localStorage.getItem(STORAGE_KEY);
          }
        } else {
          storedId = await SecureStore.getItemAsync(STORAGE_KEY);
        }
        
        if (storedId && MOCK_EVENTS.find(e => e.id === storedId)) {
          setSelectedEventId(storedId);
        }
      } catch (err) {
        console.error("Failed to load selected event", err);
      }
    };
    loadSelectedEvent();
  }, []);

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

  const selectedEvent = MOCK_EVENTS.find(e => e.id === selectedEventId) || MOCK_EVENTS[0];

  return (
    <EventContext.Provider value={{ events: MOCK_EVENTS, selectedEvent, switchEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEventContext must be used within an EventProvider");
  return context;
};
