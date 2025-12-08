import { motion } from "framer-motion";
import FadeIn from "./FadeIn";

const colors = [
  { name: "Terracota", hex: "#B45309" },
  { name: "Nude", hex: "#D6BFA8" },
  { name: "Verde Esmeralda", hex: "#0F766E" },
  { name: "Borgonha", hex: "#7C1D2F" },
  { name: "Âmbar", hex: "#F59E0B" },
];

export default function DressCodeSection() {
  return (
    <section id="dress-code" className="py-24 bg-off-white">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <FadeIn className="mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-soft-black mb-6">Dress Code</h2>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Inspira-te em tons quentes de terracota, nudes, verdes profundos e borgonhas.
            <br />
            <span className="text-terracotta font-medium">Por favor, evita branco e off-white.</span>
          </p>
        </FadeIn>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12">
          {colors.map((color, index) => (
            <FadeIn
              key={index}
              delay={index * 0.1}
              className="flex flex-col items-center gap-3"
            >
              <div 
                className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg border-4 border-white transition-transform hover:scale-110"
                style={{ backgroundColor: color.hex }}
              />
              <span className="font-serif text-sm text-soft-black">{color.name}</span>
            </FadeIn>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
          <div className="bg-sand/10 p-6 rounded-lg border border-sand/20">
            <h3 className="font-serif text-xl text-soft-black mb-2">Para Elas</h3>
            <p className="font-sans text-sm text-muted-foreground">
              Vestidos longos ou midi em tecidos fluidos. Tons terrosos ou florais elegantes.
            </p>
          </div>
          <div className="bg-sand/10 p-6 rounded-lg border border-sand/20">
            <h3 className="font-serif text-xl text-soft-black mb-2">Para Eles</h3>
            <p className="font-sans text-sm text-muted-foreground">
              Fato completo. Gravata ou laço opcionais, mas bem-vindos. Tons de azul, cinza ou bege.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
