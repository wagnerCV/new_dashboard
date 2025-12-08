import { useEffect, useState } from "react";
import { Heart, MapPin, Calendar, Gem } from "lucide-react";
import FadeIn from "./FadeIn";
import { supabase } from "@/lib/supabase";

interface TimelineStory {
  id: string;
  year: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
}

const iconMap: Record<string, React.ReactElement> = {
  heart: <Heart className="w-5 h-5" />,
  "map-pin": <MapPin className="w-5 h-5" />,
  calendar: <Calendar className="w-5 h-5" />,
  gem: <Gem className="w-5 h-5" />,
};

export default function StoryTimeline() {
  const [stories, setStories] = useState<TimelineStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('timeline_stories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching timeline stories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="story" className="py-24 bg-off-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="story" className="py-24 bg-off-white overflow-hidden">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-soft-black mb-4">A Nossa História</h2>
          <div className="w-16 h-1 bg-terracotta mx-auto rounded-full" />
        </FadeIn>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-sand -translate-x-1/2 hidden md:block" />

          <div className="space-y-12 md:space-y-24">
            {stories.map((item, index) => (
              <FadeIn
                key={item.id}
                delay={index * 0.1}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Content Card */}
                <div className="flex-1 md:w-1/2">
                  <div
                    className={`bg-white p-8 rounded-2xl shadow-lg border border-sand/30 hover:shadow-xl transition-shadow duration-300 ${
                      index % 2 === 0 ? "md:text-right" : ""
                    }`}
                  >
                    <span className="inline-block text-terracotta font-serif text-5xl mb-4">{item.year}</span>
                    <h3 className="font-serif text-2xl text-soft-black mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>

                {/* Icon Circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 bg-terracotta rounded-full flex items-center justify-center text-white shadow-lg ring-4 ring-off-white">
                    {iconMap[item.icon_name] || iconMap.heart}
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 md:w-1/2 hidden md:block" />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
