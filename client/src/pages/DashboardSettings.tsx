import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface EventSettings {
  id: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  wedding_time: string;
  ceremony_location: string;
  ceremony_address: string;
  reception_location: string;
  reception_address: string;
  invitation_message: string;
  dress_code: string;
  instagram_url: string | null;
  facebook_url: string | null;
  website_url: string | null;
}

export default function DashboardSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
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

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const { data, error: supabaseError } = await supabase
        .from("event_settings")
        .select("*")
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (data) {
        // Format date for input (YYYY-MM-DD)
        const dateStr = data.wedding_date ? new Date(data.wedding_date).toISOString().split("T")[0] : "";
        
        // Format time for input (HH:MM)
        let timeStr = "";
        if (data.wedding_time) {
          // If it's already in HH:MM format, use it directly
          if (typeof data.wedding_time === "string" && data.wedding_time.includes(":")) {
            timeStr = data.wedding_time.substring(0, 5);
          } else {
            // Otherwise parse it
            const timeObj = new Date(`2000-01-01T${data.wedding_time}`);
            timeStr = timeObj.toTimeString().substring(0, 5);
          }
        }

        setFormData({
          groom_name: data.groom_name || "",
          bride_name: data.bride_name || "",
          wedding_date: dateStr,
          wedding_time: timeStr,
          ceremony_location: data.ceremony_location || "",
          ceremony_address: data.ceremony_address || "",
          reception_location: data.reception_location || "",
          reception_address: data.reception_address || "",
          invitation_message: data.invitation_message || "",
          dress_code: data.dress_code || "",
          instagram: data.instagram_url || "",
          facebook: data.facebook_url || "",
          website: data.website_url || "",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load settings";
      setError(errorMessage);
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.groom_name.trim()) {
      setError("Groom name is required");
      return false;
    }
    if (!formData.bride_name.trim()) {
      setError("Bride name is required");
      return false;
    }
    if (!formData.wedding_date) {
      setError("Wedding date is required");
      return false;
    }
    if (!formData.wedding_time) {
      setError("Wedding time is required");
      return false;
    }
    if (!formData.ceremony_location.trim()) {
      setError("Ceremony location is required");
      return false;
    }
    if (!formData.ceremony_address.trim()) {
      setError("Ceremony address is required");
      return false;
    }
    if (!formData.reception_location.trim()) {
      setError("Reception location is required");
      return false;
    }
    if (!formData.reception_address.trim()) {
      setError("Reception address is required");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setError("");
    setSaved(false);

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      // Prepare data for Supabase
      const updateData = {
        groom_name: formData.groom_name,
        bride_name: formData.bride_name,
        wedding_date: formData.wedding_date,
        wedding_time: formData.wedding_time,
        ceremony_location: formData.ceremony_location,
        ceremony_address: formData.ceremony_address,
        reception_location: formData.reception_location,
        reception_address: formData.reception_address,
        invitation_message: formData.invitation_message,
        dress_code: formData.dress_code,
        instagram_url: formData.instagram || null,
        facebook_url: formData.facebook || null,
        website_url: formData.website || null,
        updated_at: new Date().toISOString(),
      };

      const { error: supabaseError } = await supabase
        .from("event_settings")
        .update(updateData)
        .eq("id", (await supabase.from("event_settings").select("id").single()).data?.id);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save settings";
      setError(errorMessage);
      console.error("Error saving settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "content", label: "Content" },
    { id: "social", label: "Social Media" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-600"></div>
          <p className="text-terracotta-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair text-terracotta-900 mb-2">Invitation Settings</h1>
        <p className="text-sand-600">Customize your wedding invitation</p>
      </div>

      {saved && (
        <Alert className="bg-emerald-50 border-emerald-200">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-900">Settings saved successfully! Changes will appear on your invitation.</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-burgundy-50 border-burgundy-200">
          <AlertCircle className="h-4 w-4 text-burgundy-600" />
          <AlertDescription className="text-burgundy-900">{error}</AlertDescription>
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
                    Groom Name *
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
                    Bride Name *
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
                    Wedding Date *
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
                    Wedding Time *
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
                  Ceremony Location *
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
                  Ceremony Address *
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
                  Reception Location *
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
                  Reception Address *
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
  disabled={saving}
  className="
    w-full
    bg-blue-600
    hover:bg-blue-700
    text-white
    font-medium
    disabled:bg-blue-400
    disabled:opacity-70
  "
>
  {saving ? "Saving..." : "Save Changes"}
</Button>

        </CardContent>
      </Card>
    </div>
  );
}
