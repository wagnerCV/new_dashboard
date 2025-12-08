import { motion } from "framer-motion";
import { useEventSettings } from "@/contexts/EventContext";
import FadeIn from "./FadeIn";

export default function InvitationSection() {
  const { settings } = useEventSettings();
  const date = new Date(settings.wedding_date);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section id="invitation" className="relative py-24 px-4 md:py-32 bg-off-white overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <img src="/images/texture-bg.jpg" alt="" className="w-full h-full object-cover" />
      </div>

      <div className="container relative z-10 max-w-4xl mx-auto">
        <FadeIn className="bg-off-white/80 backdrop-blur-sm border border-sand p-8 md:p-16 text-center shadow-xl shadow-sand/10 relative">
          {/* Decorative Corners - Animated */}
          <motion.div 
            initial={{ scaleX: 0 }} 
            whileInView={{ scaleX: 1 }} 
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute top-4 left-4 w-16 h-px bg-terracotta/30 origin-left" 
          />
          <motion.div 
            initial={{ scaleY: 0 }} 
            whileInView={{ scaleY: 1 }} 
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute top-4 left-4 w-px h-16 bg-terracotta/30 origin-top" 
          />
          
          <motion.div 
            initial={{ scaleX: 0 }} 
            whileInView={{ scaleX: 1 }} 
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute top-4 right-4 w-16 h-px bg-terracotta/30 origin-right" 
          />
          <motion.div 
            initial={{ scaleY: 0 }} 
            whileInView={{ scaleY: 1 }} 
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute top-4 right-4 w-px h-16 bg-terracotta/30 origin-top" 
          />

          <motion.div 
            initial={{ scaleX: 0 }} 
            whileInView={{ scaleX: 1 }} 
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute bottom-4 left-4 w-16 h-px bg-terracotta/30 origin-left" 
          />
          <motion.div 
            initial={{ scaleY: 0 }} 
            whileInView={{ scaleY: 1 }} 
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute bottom-4 left-4 w-px h-16 bg-terracotta/30 origin-bottom" 
          />

          <motion.div 
            initial={{ scaleX: 0 }} 
            whileInView={{ scaleX: 1 }} 
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute bottom-4 right-4 w-16 h-px bg-terracotta/30 origin-right" 
          />
          <motion.div 
            initial={{ scaleY: 0 }} 
            whileInView={{ scaleY: 1 }} 
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute bottom-4 right-4 w-px h-16 bg-terracotta/30 origin-bottom" 
          />

          <h2 className="font-serif text-4xl md:text-6xl text-soft-black mb-8">
            {settings.groom_name} & {settings.bride_name}
          </h2>

          <div className="w-12 h-px bg-terracotta mx-auto mb-8" />

          <p className="font-sans text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
            Com imensa alegria, convidamos-te para celebrar o início da nossa vida juntos. 
            A tua presença é o presente mais valioso que poderíamos receber neste dia tão especial.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 font-serif text-soft-black">
            <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
              <span className="block text-sm font-sans uppercase tracking-widest text-terracotta mb-2">Data</span>
              <span className="text-2xl md:text-3xl">{date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' })}</span>
              <span className="block text-xl mt-1">{date.getFullYear()}</span>
            </div>

            <div className="h-12 w-px bg-sand hidden md:block" />

            <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
              <span className="block text-sm font-sans uppercase tracking-widest text-terracotta mb-2">Hora</span>
              <span className="text-2xl md:text-3xl">{settings.wedding_time}</span>
              <span className="block text-xl mt-1">Manhã</span>
            </div>

            <div className="h-12 w-px bg-sand hidden md:block" />

            <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
              <span className="block text-sm font-sans uppercase tracking-widest text-terracotta mb-2">Local</span>
              <span className="text-2xl md:text-3xl">{settings.ceremony_address.split(',')[0]}</span>
              <span className="block text-xl mt-1">Portugal</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
