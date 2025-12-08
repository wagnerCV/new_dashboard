import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { RSVPProvider } from "./contexts/RSVPContext";
import { EventProvider } from "./contexts/EventContext";
import Dashboard from "./pages/Dashboard";

function Router() {
  const [location, setLocation] = useLocation();

  // Redirect root to dashboard
  useEffect(() => {
    if (location === "/") {
      setLocation("/dashboard/login");
    }
  }, [location, setLocation]);

  return (
    <Switch>
      <Route path="/dashboard/*" component={Dashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <EventProvider>
          <RSVPProvider>
            <TooltipProvider>
          <Toaster />
            <Router />
            </TooltipProvider>
          </RSVPProvider>
        </EventProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
