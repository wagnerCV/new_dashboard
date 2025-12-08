import { useEffect, useState } from "react";
import { Route, Switch, useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardLogin from "./DashboardLogin";
import DashboardGuests from "./DashboardGuests";
import DashboardSettings from "./DashboardSettings";
import DashboardProfile from "./DashboardProfile";
import ProtectedRoute from "@/components/ProtectedRoute";
import { DashboardAuthProvider, useDashboardAuth } from "@/contexts/DashboardAuthContext";

function DashboardRouter() {
  const { user, loading } = useDashboardAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/dashboard/login");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-600"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/dashboard/login" component={DashboardLogin} />
      <Route path="/dashboard/guests">
        {user ? <DashboardLayout><DashboardGuests /></DashboardLayout> : <DashboardLogin />}
      </Route>
      <Route path="/dashboard/settings">
        {user ? <DashboardLayout><DashboardSettings /></DashboardLayout> : <DashboardLogin />}
      </Route>
      <Route path="/dashboard/profile">
        {user ? <DashboardLayout><DashboardProfile /></DashboardLayout> : <DashboardLogin />}
      </Route>
      <Route path="/dashboard">
        {user ? <DashboardLayout><DashboardGuests /></DashboardLayout> : <DashboardLogin />}
      </Route>
    </Switch>
  );
}

export default function Dashboard() {
  return (
    <DashboardAuthProvider>
      <DashboardRouter />
    </DashboardAuthProvider>
  );
}
