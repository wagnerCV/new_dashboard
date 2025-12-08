import { useState } from "react";
import { useLocation } from "wouter";
import { useDashboardAuth } from "@/contexts/DashboardAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DashboardLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useDashboardAuth();
  const [, setLocation] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      setLocation("/dashboard/guests");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-terracotta-50 via-off-white to-sand-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-terracotta-200 shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-playfair text-terracotta-900">
            Wedding Dashboard
          </CardTitle>
          <CardDescription className="text-base">
            Bride & Groom Access Only
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert className="bg-burgundy-50 border-burgundy-200 text-burgundy-900">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-soft-black">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="bride@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-terracotta-200 focus:border-terracotta-500 focus:ring-terracotta-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-soft-black">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-terracotta-200 focus:border-terracotta-500 focus:ring-terracotta-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-600 hover:text-terracotta-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-sand-600">
            Only the bride and groom can access this dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
