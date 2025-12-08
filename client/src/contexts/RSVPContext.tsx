import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface RSVPData {
  name: string;
  email?: string;
  phone?: string;
  status: "yes" | "no" | "maybe";
  party_size: number;
  going_to_reception: boolean;
  dietary_restrictions?: string;
  message?: string;
}

interface RSVPContextType {
  isUnlocked: boolean;
  saveRSVP: (data: RSVPData) => Promise<void>;
}

const RSVPContext = createContext<RSVPContextType | undefined>(undefined);

export function RSVPProvider({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // Check local storage on mount to see if user already RSVP'd
    const savedStatus = localStorage.getItem("rsvp_confirmed");
    if (savedStatus === "true") {
      setIsUnlocked(true);
    }
  }, []);

  const saveRSVP = async (data: RSVPData) => {
    try {
      // 1. Save to Supabase
      const { error } = await supabase.from("rsvps").insert([
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: data.status,
          party_size: data.party_size,
          going_to_reception: data.going_to_reception,
          dietary_restrictions: data.dietary_restrictions,
          message: data.message,
        },
      ]);

      if (error) {
        // Check if error is due to missing table
        if (error.message?.includes('relation "public.rsvps" does not exist')) {
          console.error("Database table missing:", error);
          toast.error("Erro de configuração: Tabela de dados não encontrada. Por favor contacte os noivos.");
          throw new Error("Table missing");
        }
        throw error;
      }

      // 2. Update Local State
      if (data.status === "yes") {
        setIsUnlocked(true);
        localStorage.setItem("rsvp_confirmed", "true");
      }

    } catch (error) {
      console.error("Error saving RSVP:", error);
      toast.error("Ocorreu um erro ao guardar a tua resposta. Por favor tenta novamente.");
      throw error;
    }
  };

  return (
    <RSVPContext.Provider value={{ isUnlocked, saveRSVP }}>
      {children}
    </RSVPContext.Provider>
  );
}

export function useRSVP() {
  const context = useContext(RSVPContext);
  if (context === undefined) {
    throw new Error("useRSVP must be used within a RSVPProvider");
  }
  return context;
}
