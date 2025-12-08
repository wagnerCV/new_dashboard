import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

export default function DashboardSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    groom_name: "",
    bride_name: "",
    wedding_date: "",
    wedding_time: "",
    ceremony_location: "",
    ceremony_address: "",
    reception_location: "",
    reception_address: "",
    invitation_message: "",
    dress_code: "",
    instagram: "",
    facebook: "",
    website: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Placeholder: In production, save to Supabase
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "content", label: "Content" },
    { id: "social", label: "Social Media" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair text-terracotta-900 mb-2">Invitation Settings</h1>
        <p className="text-sand-600">Customize your wedding invitation</p>
      </div>

      {saved && (
        <Alert className="bg-emerald-50 border-emerald-200">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-900">Settings saved successfully!</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2 border-b border-terracotta-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-terracotta-600 text-terracotta-900"
                : "border-transparent text-sand-600 hover:text-terracotta-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === "general" && "General Information"}
            {activeTab === "content" && "Invitation Content"}
            {activeTab === "social" && "Social Media Links"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeTab === "general" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-soft-black mb-1">
                    Groom Name
                  </label>
                  <Input
                    name="groom_name"
                    value={formData.groom_name}
                    onChange={handleChange}
                    placeholder="Groom's name"
                    className="border-terracotta-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-soft-black mb-1">
                    Bride Name
                  </label>
                  <Input
                    name="bride_name"
                    value={formData.bride_name}
                    onChange={handleChange}
                    placeholder="Bride's name"
                    className="border-terracotta-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-soft-black mb-1">
                    Wedding Date
                  </label>
                  <Input
                    name="wedding_date"
                    type="date"
                    value={formData.wedding_date}
                    onChange={handleChange}
                    className="border-terracotta-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-soft-black mb-1">
                    Wedding Time
                  </label>
                  <Input
                    name="wedding_time"
                    type="time"
                    value={formData.wedding_time}
                    onChange={handleChange}
                    className="border-terracotta-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-soft-black mb-1">
                  Ceremony Location
                </label>
                <Input
                  name="ceremony_location"
                  value={formData.ceremony_location}
                  onChange={handleChange}
                  placeholder="Church or venue name"
                  className="border-terracotta-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-soft-black mb-1">
                  Ceremony Address
                </label>
                <Input
                  name="ceremony_address"
                  value={formData.ceremony_address}
                  onChange={handleChange}
                  placeholder="Full address"
                  className="border-terracotta-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-soft-black mb-1">
                  Reception Location
                </label>
                <Input
                  name="reception_location"
                  value={formData.reception_location}
                  onChange={handleChange}
                  placeholder="Venue name"
                  className="border-terracotta-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-soft-black mb-1">
                  Reception Address
                </label>
                <Input
                  name="reception_address"
                  value={formData.reception_address}
                  onChange={handleChange}
                  placeholder="Full address"
                  className="border-terracotta-200"
                />
              </div>
            </>
          )}

          {activeTab === "content" && (
            <>
              <div>
                <label className="block text-sm font-medium text-soft-black mb-1">
                  Invitation Message
                </label>
                <Textarea
                  name="invitation_message"
                  value={formData.invitation_message}
                  onChange={handleChange}
                  placeholder="Write your invitation message..."
                  rows={4}
                  className="border-terracotta-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-soft-black mb-1">
                  Dress Code
                </label>
                <Input
                  name="dress_code"
                  value={formData.dress_code}
                  onChange={handleChange}
                  placeholder="e.g., Black Tie, Cocktail Attire"
                  className="border-terracotta-200"
                />
              </div>
            </>
          )}

          {activeTab === "social" && (
            <>
              <div>
                <label className="block text-sm font-medium text-soft-black mb-1">
                  Instagram
                </label>
                <Input
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  className="border-terracotta-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-soft-black mb-1">
                  Facebook
                </label>
                <Input
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  className="border-terracotta-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-soft-black mb-1">
                  Website
                </label>
                <Input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="border-terracotta-200"
                />
              </div>
            </>
          )}

          <Button
            onClick={handleSave}
            className="bg-terracotta-600 hover:bg-terracotta-700 text-white font-medium w-full"
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
