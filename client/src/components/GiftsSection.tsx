import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, CreditCard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function GiftsSection() {
  return (
    <section className="py-24 bg-off-white">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <Gift className="w-12 h-12 text-terracotta mx-auto opacity-50" />
          
          <h2 className="font-serif text-3xl md:text-4xl text-soft-black">Presentes</h2>
          
          <p className="font-sans text-muted-foreground leading-relaxed">
            A vossa presença é o melhor presente que poderíamos receber. 
            No entanto, se desejarem contribuir para o início da nossa vida a dois, 
            ficaremos imensamente gratos.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-14 px-8 border-terracotta text-terracotta hover:bg-terracotta hover:text-white transition-colors font-serif text-lg">
                  <CreditCard className="mr-2 w-5 h-5" />
                  Dados Bancários
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-off-white border-sand">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl text-center text-soft-black">Dados Bancários</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="bg-white p-6 rounded-lg border border-sand/30 text-center space-y-2">
                    <p className="text-sm text-muted-foreground uppercase tracking-widest">IBAN</p>
                    <p className="font-mono text-lg md:text-xl text-soft-black select-all">PT50 0000 0000 0000 0000 0000 0</p>
                    <p className="text-xs text-muted-foreground mt-2">Titular: Jorge Borges</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-sand/30 text-center space-y-2">
                    <p className="text-sm text-muted-foreground uppercase tracking-widest">MBWAY</p>
                    <p className="font-mono text-lg md:text-xl text-soft-black select-all">910 000 000</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-14 px-8 border-emerald text-emerald hover:bg-emerald hover:text-white transition-colors font-serif text-lg">
                  <Gift className="mr-2 w-5 h-5" />
                  Lista de Presentes
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-off-white border-sand">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl text-center text-soft-black">Lista de Casamento</DialogTitle>
                </DialogHeader>
                <div className="py-8 text-center space-y-4">
                  <p className="text-muted-foreground">
                    Criámos uma lista de sugestões numa loja parceira.
                  </p>
                  <Button className="bg-emerald hover:bg-emerald/90 text-white w-full h-12">
                    Ver Lista Online
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
