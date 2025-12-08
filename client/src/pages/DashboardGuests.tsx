import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Download } from "lucide-react";

export default function DashboardGuests() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Placeholder: In production, fetch from Supabase
    setLoading(false);
    setGuests([]);
  }, []);

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || guest.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    if (guests.length === 0) {
      setError("No guests to export");
      return;
    }

    const headers = ["Name", "Email", "Phone", "Status", "Guests", "Dietary Restrictions"];
    const csvContent = [
      headers.join(","),
      ...guests.map((g) =>
        [
          `"${g.name || ""}"`,
          `"${g.email || ""}"`,
          `"${g.phone || ""}"`,
          g.status || "pending",
          g.total_guests || 1,
          `"${g.dietary_restrictions || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "guests.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair text-terracotta-900 mb-2">Guest Management</h1>
        <p className="text-sand-600">View and manage your wedding guests</p>
      </div>

      {error && (
        <Alert className="bg-burgundy-50 border-burgundy-200">
          <AlertCircle className="h-4 w-4 text-burgundy-600" />
          <AlertDescription className="text-burgundy-900">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-sand-600">Total Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-terracotta-900">{guests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-sand-600">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {guests.filter((g) => g.status === "confirmed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-sand-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sand-600">
              {guests.filter((g) => g.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-sand-600">Declined</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-burgundy-600">
              {guests.filter((g) => g.status === "declined").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Guests</CardTitle>
              <CardDescription>Showing {filteredGuests.length} guests</CardDescription>
            </div>
            <Button
              onClick={handleExportCSV}
              className="bg-terracotta-600 hover:bg-terracotta-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-terracotta-200"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-terracotta-200 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta-600"></div>
            </div>
          ) : filteredGuests.length === 0 ? (
            <div className="text-center py-8 text-sand-600">
              {guests.length === 0 ? "No guests yet" : "No guests match your filters"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-terracotta-200">
                    <th className="text-left py-2 px-4 font-semibold text-terracotta-900">Name</th>
                    <th className="text-left py-2 px-4 font-semibold text-terracotta-900">Email</th>
                    <th className="text-left py-2 px-4 font-semibold text-terracotta-900">Status</th>
                    <th className="text-left py-2 px-4 font-semibold text-terracotta-900">Guests</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((guest, idx) => (
                    <tr key={idx} className="border-b border-sand-100 hover:bg-sand-50">
                      <td className="py-3 px-4">{guest.name || "—"}</td>
                      <td className="py-3 px-4 text-sand-600">{guest.email || "—"}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            guest.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-700"
                              : guest.status === "declined"
                                ? "bg-burgundy-100 text-burgundy-700"
                                : "bg-sand-100 text-sand-700"
                          }`}
                        >
                          {guest.status || "pending"}
                        </span>
                      </td>
                      <td className="py-3 px-4">{guest.total_guests || 1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
