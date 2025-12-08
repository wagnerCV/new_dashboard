import { useState } from "react";
import { useRSVP } from "@/contexts/RSVPContext";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "./FadeIn";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4;

export default function RSVPSection() {
  const { saveRSVP } = useRSVP();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    attending: "",
    guests: 1,
    message: "",
    name: "",
    email: "",
    phone: "",
  });

  const handleNext = () => {
    if (step === 1 && !formData.attending) {
      toast.error("Por favor, seleciona uma opção.");
      return;
    }
    if (step === 2 && !formData.name) {
      toast.error("Por favor, introduz o teu nome.");
      return;
    }
    setStep((prev) => (prev + 1) as Step);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      await saveRSVP({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: formData.attending as "yes" | "no" | "maybe",
        party_size: formData.guests,
        going_to_reception: formData.attending === "yes",
        dietary_restrictions: "", // Removed as requested
        message: formData.message,
      });
      
      setStep(4);
      toast.success("RSVP enviado com sucesso!");
    } catch (error) {
      // Error is handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section id="rsvp" className="py-24 bg-sand/20 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-2xl">
        <FadeIn className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-soft-black mb-4">R.S.V.P.</h2>
          <p className="font-sans text-muted-foreground">Por favor, confirma a tua presença até 01 de Julho.</p>
        </FadeIn>

        <FadeIn className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-sand/30 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
          {/* Progress Bar */}
          {step < 4 && (
            <div className="absolute top-0 left-0 w-full h-1 bg-sand/20">
              <motion.div 
                className="h-full bg-terracotta"
                initial={{ width: "0%" }}
                animate={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h3 className="font-serif text-2xl text-center text-soft-black">Vais celebrar connosco?</h3>
                
                <RadioGroup 
                  value={formData.attending} 
                  onValueChange={(val) => updateFormData("attending", val)}
                  className="space-y-4"
                >
                  <div className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${formData.attending === "yes" ? "border-terracotta bg-terracotta/5" : "border-input hover:bg-sand/10"}`}>
                    <Label htmlFor="yes" className="flex-1 cursor-pointer font-sans text-lg">Sim, claro!</Label>
                    <RadioGroupItem value="yes" id="yes" className="text-terracotta" />
                  </div>
                  <div className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${formData.attending === "maybe" ? "border-terracotta bg-terracotta/5" : "border-input hover:bg-sand/10"}`}>
                    <Label htmlFor="maybe" className="flex-1 cursor-pointer font-sans text-lg">Ainda não tenho certeza</Label>
                    <RadioGroupItem value="maybe" id="maybe" className="text-terracotta" />
                  </div>
                  <div className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${formData.attending === "no" ? "border-terracotta bg-terracotta/5" : "border-input hover:bg-sand/10"}`}>
                    <Label htmlFor="no" className="flex-1 cursor-pointer font-sans text-lg">Infelizmente não posso</Label>
                    <RadioGroupItem value="no" id="no" className="text-terracotta" />
                  </div>
                </RadioGroup>

                <Button onClick={handleNext} className="w-full bg-terracotta hover:bg-terracotta/90 text-white h-12 text-lg font-serif">
                  Continuar <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="font-serif text-2xl text-center text-soft-black">Os teus dados</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={(e) => updateFormData("name", e.target.value)}
                    className="h-12 border-sand focus:ring-terracotta"
                    placeholder="Escreve o teu nome"
                  />
                </div>

                {formData.attending === "yes" && (
                  <div className="space-y-2">
                    <Label htmlFor="guests">Número de Pessoas (incluindo tu)</Label>
                    <select 
                      id="guests"
                      value={formData.guests}
                      onChange={(e) => updateFormData("guests", parseInt(e.target.value))}
                      className="w-full h-12 rounded-md border border-sand bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Pessoa' : 'Pessoas'}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12">
                    Voltar
                  </Button>
                  <Button onClick={handleNext} className="flex-1 bg-terracotta hover:bg-terracotta/90 text-white h-12">
                    Continuar
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="font-serif text-2xl text-center text-soft-black">Uma mensagem para os noivos?</h3>
                
                <Textarea 
                  value={formData.message}
                  onChange={(e) => updateFormData("message", e.target.value)}
                  placeholder="Deixa uma mensagem de carinho (opcional)..."
                  className="min-h-[150px] border-sand focus:ring-terracotta resize-none"
                />

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12">
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="flex-1 bg-terracotta hover:bg-terracotta/90 text-white h-12"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirmar RSVP"}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-8"
              >
                <div className="w-20 h-20 bg-emerald/10 rounded-full flex items-center justify-center mx-auto text-emerald">
                  <Check className="w-10 h-10" />
                </div>
                
                <h3 className="font-serif text-3xl text-soft-black">Obrigado!</h3>
                <p className="font-sans text-lg text-muted-foreground max-w-md mx-auto">
                  A tua presença já faz parte da nossa história. Obrigado por confirmares 🥂
                </p>
                
                <div className="pt-8">
                  <p className="text-sm text-sand uppercase tracking-widest">Jorge & Ana</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </FadeIn>
      </div>
    </section>
  );
}
