import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardAuth } from "@/contexts/DashboardAuthContext";
import { useLocation } from "wouter";

export default function DashboardProfile() {
  const { user, logout } = useDashboardAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/dashboard/login");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair text-terracotta-900 mb-2">Profile</h1>
        <p className="text-sand-600">Your account information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your admin account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-sand-600">Email</label>
              <p className="text-lg text-soft-black mt-1">{user?.email || "—"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-sand-600">Role</label>
              <p className="text-lg text-soft-black mt-1 capitalize">
                {user?.role || "Admin"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-sand-600">Status</label>
              <p className="text-lg text-soft-black mt-1">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  Active
                </span>
              </p>
            </div>

            <div className="pt-4 border-t border-sand-200">
              <Button
                onClick={handleLogout}
                className="bg-burgundy-600 hover:bg-burgundy-700 text-white font-medium"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/dashboard/guests"
              className="block px-4 py-2 rounded-lg bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-900 font-medium transition-colors"
            >
              Guest Management
            </a>
            <a
              href="/dashboard/settings"
              className="block px-4 py-2 rounded-lg bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-900 font-medium transition-colors"
            >
              Invitation Settings
            </a>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-medium transition-colors"
            >
              View Invitation
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
