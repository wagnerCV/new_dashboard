import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface EventSettings {
  groom_name: string;
  bride_name: string;
  wedding_date: string; // ISO string
  wedding_time: string;
  ceremony_location: string;
  ceremony_address: string;
  reception_location: string;
  reception_address: string;
  countdown_target: string; // ISO string
}

// Default fallback settings
const defaultSettings: EventSettings = {
  groom_name: "Jorge Borges",
  bride_name: "Ana Oliveira",
  wedding_date: "2026-09-05",
  wedding_time: "10:00",
  ceremony_location: "Santuário do Cristo Rei",
  ceremony_address: "Almada, Portugal",
  reception_location: "Quinta do Roseiral",
  reception_address: "Ericeira, Portugal",
  countdown_target: "2026-09-05T10:00:00",
};

interface EventContextType {
  settings: EventSettings;
  loading: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<EventSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from("event_settings")
          .select("*")
          .single();

        if (error) {
          console.warn("Could not fetch settings, using defaults:", error.message);
          return;
        }

        if (data) {
          setSettings(data);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return (
    <EventContext.Provider value={{ settings, loading }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEventSettings() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEventSettings must be used within an EventProvider");
  }
  return context;
}
