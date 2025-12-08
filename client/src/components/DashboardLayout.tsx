import { useState } from "react";
import { useLocation } from "wouter";
import { useDashboardAuth } from "@/contexts/DashboardAuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Home, Users, Settings, User } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [location, setLocation] = useLocation();
  const { user, logout } = useDashboardAuth();

  const handleLogout = async () => {
    await logout();
    setLocation("/dashboard/login");
  };

  const navItems = [
    { href: "/dashboard/guests", label: "Guests", icon: Users },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex h-screen bg-off-white">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-terracotta-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-terracotta-800 flex items-center justify-between">
          <h1 className={`font-playfair font-bold ${sidebarOpen ? "text-xl" : "hidden"}`}>
            Wedding
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-terracotta-800 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <button
                key={item.href}
                onClick={() => setLocation(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-terracotta-700 text-white"
                    : "text-terracotta-100 hover:bg-terracotta-800"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-terracotta-800 space-y-3">
          {sidebarOpen && (
            <div className="text-sm">
              <p className="text-terracotta-200">Logged in as</p>
              <p className="font-medium truncate">{user?.email}</p>
            </div>
          )}
          <Button
            onClick={handleLogout}
            className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            {sidebarOpen && "Sign Out"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-sand-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-playfair text-terracotta-900">Dashboard</h2>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
            >
              <Home size={18} />
              View Invitation
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
