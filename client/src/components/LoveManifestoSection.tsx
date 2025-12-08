import { motion } from "framer-motion";

export default function LoveManifestoSection() {
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-off-white to-sand/20 overflow-hidden">
      <div className="container max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        
        {/* Image Side */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 relative aspect-square md:aspect-[4/5] overflow-hidden rounded-t-[10rem] shadow-2xl"
        >
          <img 
            src="/images/manifesto-bg.jpg" 
            alt="Olive branch on terracotta" 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </motion.div>

        {/* Text Side */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full md:w-1/2 text-center md:text-left"
        >
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-sand/30 relative">
            <span className="absolute -top-6 left-1/2 md:left-12 -translate-x-1/2 md:translate-x-0 text-6xl text-terracotta/20 font-serif">“</span>
            
            <blockquote className="font-serif text-xl md:text-2xl leading-relaxed text-soft-black">
              <span className="text-terracotta font-medium italic block mb-4 text-2xl md:text-3xl">
                O amor é paciente, o amor é bondoso.
              </span>
              Não inveja, não se vangloria, não se orgulha. Não maltrata, não procura seus interesses, não se ira facilmente, não guarda rancor. 
              <br /><br />
              O amor não se alegra com a injustiça, mas se alegra com a verdade. 
              <span className="text-emerald font-medium block mt-4">
                Tudo sofre, tudo crê, tudo espera, tudo suporta.
              </span>
            </blockquote>
            
            <div className="mt-8 flex items-center justify-center md:justify-start gap-4">
              <div className="h-px w-12 bg-terracotta" />
              <span className="font-sans text-sm uppercase tracking-widest text-muted-foreground">1 Coríntios 13:4-7</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
