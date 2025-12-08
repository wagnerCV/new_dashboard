import { motion } from "framer-motion";
import { MapPin, CalendarPlus } from "lucide-react";

export default function MapSection() {
  const handleAddToCalendar = () => {
    // Create .ics content
    const event = {
      title: "Casamento Jorge & Ana",
      description: "Celebração do casamento de Jorge Borges e Ana Oliveira",
      location: "Igreja de São Francisco Xavier da Caparica, R. das Quintas 7 11, 2825-171 Caparica",
      startTime: "20260905T100000",
      endTime: "20260905T230000",
    };
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
DTSTART:${event.startTime}
DTEND:${event.endTime}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "casamento-jorge-ana.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-24 bg-soft-black text-off-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/3 space-y-8"
          >
            <div>
              <h2 className="font-serif text-4xl md:text-5xl mb-4">Como Chegar</h2>
              <p className="font-sans text-sand/80 leading-relaxed">
                A cerimónia terá lugar na histórica Igreja de São Francisco Xavier da Caparica.
                Recomendamos o uso de GPS para evitar atrasos.
              </p>
            </div>

            <div className="space-y-4">
              <a 
                href="https://maps.google.com/?q=Igreja+de+São+Francisco+Xavier+da+Caparica" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
              >
                <div className="w-10 h-10 rounded-full bg-terracotta flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-serif text-lg">Abrir no Google Maps</span>
                  <span className="text-sm text-sand/60">Ver direções</span>
                </div>
              </a>

              <button 
                onClick={handleAddToCalendar}
                className="w-full flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group text-left"
              >
                <div className="w-10 h-10 rounded-full bg-emerald flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <CalendarPlus className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-serif text-lg">Adicionar à Agenda</span>
                  <span className="text-sm text-sand/60">Guardar o evento</span>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Map Embed */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-2/3 h-[400px] lg:h-[500px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3116.586666466666!2d-9.200000!3d38.666667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1936e666666667%3A0x6666666666666666!2sIgreja%20de%20S%C3%A3o%20Francisco%20Xavier%20da%20Caparica!5e0!3m2!1spt-PT!2spt!4v1620000000000!5m2!1spt-PT!2spt" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: "grayscale(100%) invert(90%) contrast(80%)" }} 
              allowFullScreen 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
