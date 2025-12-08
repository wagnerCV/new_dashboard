import { motion, useScroll, useTransform } from "framer-motion";
import { useEventSettings } from "@/contexts/EventContext";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";

export default function HeroSection() {
  const { settings } = useEventSettings();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToContent = () => {
    const element = document.getElementById("invitation");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" ref={ref} className="relative h-screen w-full overflow-hidden bg-soft-black text-off-white">
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-black/30 z-10" /> {/* Lighter overlay to match screenshot */}
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          src="/images/hero-portal.jpg" 
          alt="Terracotta Portal" 
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-2"
        >
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-medium leading-tight tracking-tight text-off-white drop-shadow-lg">
            {settings.groom_name}
          </h1>
          
          <div className="font-serif text-5xl md:text-7xl text-off-white/90 my-4">
            &
          </div>

          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-medium leading-tight tracking-tight text-off-white drop-shadow-lg">
            {settings.bride_name}
          </h1>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-12 flex justify-center"
          >
            <div className="rounded-full border border-white/30 bg-black/20 px-8 py-3 backdrop-blur-sm">
              <p className="font-sans text-sm md:text-base font-light tracking-[0.2em] text-white uppercase">
                Save the Date · {new Date(settings.wedding_date).toLocaleDateString('pt-PT').replace(/\//g, '.')} · {settings.wedding_time} · {settings.ceremony_address.split(',')[0].toUpperCase()}
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2"
        >
          <button 
            onClick={scrollToContent}
            className="group flex flex-col items-center gap-4 text-sand transition-colors hover:text-white"
          >
            <span className="font-serif text-sm tracking-[0.2em] uppercase text-sand/90">Entrar no convite</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowDown className="h-6 w-6 opacity-70 group-hover:opacity-100 font-thin" />
            </motion.div>
          </button>
        </motion.div>
      </div>

      {/* Subtle Quote Overlay - Static as per screenshot */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-[0.05]">
        <h2 className="text-center font-serif text-[15vw] leading-none text-white">
          O AMOR É<br />PACIENTE
        </h2>
      </div>
    </section>
  );
}
