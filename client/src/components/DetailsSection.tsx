import { motion } from "framer-motion";
import { Church, GlassWater, Car } from "lucide-react";
import { useEventSettings } from "@/contexts/EventContext";
import { useRSVP } from "@/contexts/RSVPContext";
import FadeIn from "./FadeIn";

export default function DetailsSection() {
  const { settings } = useEventSettings();
  const { isUnlocked } = useRSVP();

  const details = [
    {
      title: "Cerimónia",
      time: settings.wedding_time,
      location: settings.ceremony_location,
      address: settings.ceremony_address,
      icon: <Church className="w-8 h-8" />,
      type: "public",
      mapLink: `https://maps.google.com/?q=${encodeURIComponent(settings.ceremony_location + " " + settings.ceremony_address)}`
    },
    {
      title: "Receção / Festa",
      time: "12h30", // Could be dynamic if added to settings
      location: settings.reception_location,
      address: settings.reception_address,
      icon: <GlassWater className="w-8 h-8" />,
      type: "restricted",
      mapLink: `https://maps.google.com/?q=${encodeURIComponent(settings.reception_location + " " + settings.reception_address)}`
    },
    {
      title: "Informações Úteis",
      time: "Estacionamento",
      location: "Disponível no local",
      address: "Recomendamos chegar 15 minutos antes.",
      icon: <Car className="w-8 h-8" />,
      type: "public",
      mapLink: null
    },
  ];

  return (
    <section id="details" className="py-24 bg-sand/10">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-soft-black mb-4">Detalhes do Dia</h2>
          <p className="font-sans text-muted-foreground">Tudo o que precisas de saber</p>
        </FadeIn>

        <div className="flex flex-wrap justify-center gap-8">
          {details.map((item, index) => {
            // Hide restricted items if not unlocked
            if (item.type === "restricted" && !isUnlocked) return null;

            return (
              <FadeIn
                key={index}
                delay={index * 0.1}
                className="bg-white p-8 rounded-xl shadow-sm border border-sand/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group w-full md:w-[calc(33.333%-2rem)] min-w-[300px]"
              >
                <a 
                  href={item.mapLink || "#"} 
                  target={item.mapLink ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={`block ${!item.mapLink ? 'cursor-default' : ''}`}
                >
                  <div className="w-16 h-16 bg-off-white rounded-full flex items-center justify-center text-emerald mb-6 group-hover:bg-emerald group-hover:text-white transition-colors duration-300 mx-auto">
                    {item.icon}
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-serif text-2xl text-soft-black mb-2">{item.title}</h3>
                    <div className="w-8 h-px bg-terracotta mx-auto mb-4" />
                    
                    <p className="font-sans font-medium text-terracotta mb-1">{item.time}</p>
                    <p className="font-sans text-soft-black mb-2">{item.location}</p>
                    <p className="font-sans text-sm text-muted-foreground">{item.address}</p>
                  </div>
                </a>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
