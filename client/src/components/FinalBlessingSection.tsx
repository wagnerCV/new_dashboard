import { motion } from "framer-motion";

export default function FinalBlessingSection() {
  return (
    <section className="py-32 bg-soft-black text-off-white relative overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-terracotta/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="space-y-12"
        >
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-emerald to-transparent mx-auto" />

          <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight max-w-4xl mx-auto text-sand/90">
            “Tudo sofre, tudo crê,<br />
            tudo espera, tudo suporta.”
          </h2>

          <div className="space-y-4 pt-8">
            <p className="font-serif text-2xl md:text-3xl text-white">Jorge & Ana</p>
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-sand/60">05 . 09 . 2026</p>
          </div>

          <div className="pt-16 text-xs text-white/20 font-sans">
            <p>Feito com amor.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
