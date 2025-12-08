import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AdminUser {
  id: string;
  email: string;
  role: "bride" | "groom" | "admin";
  full_name?: string;
}

interface DashboardAuthContextType {
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const DashboardAuthContext = createContext<DashboardAuthContextType | undefined>(undefined);

export function DashboardAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (data.session?.user) {
        // Fetch admin user details
        const { data: adminUser, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("auth_user_id", data.session.user.id)
          .single();

        if (adminError) throw adminError;

        setUser({
          id: data.session.user.id,
          email: data.session.user.email || "",
          role: adminUser?.role || "admin",
          full_name: adminUser?.full_name,
        });
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch admin user details
        const { data: adminUser, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("auth_user_id", data.user.id)
          .single();

        if (adminError) throw new Error("User is not an admin");

        setUser({
          id: data.user.id,
          email: data.user.email || "",
          role: adminUser?.role || "admin",
          full_name: adminUser?.full_name,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <DashboardAuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </DashboardAuthContext.Provider>
  );
}

export function useDashboardAuth() {
  const context = useContext(DashboardAuthContext);
  if (!context) {
    throw new Error("useDashboardAuth must be used within DashboardAuthProvider");
  }
  return context;
}
