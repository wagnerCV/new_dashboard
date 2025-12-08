import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Navbar() {
  const [, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Convite", href: "#invitation" },
    { name: "História", href: "#story" },
    { name: "Detalhes", href: "#details" },
    { name: "Dress Code", href: "#dress-code" },
    { name: "RSVP", href: "#rsvp" },
  ];

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <div className="pointer-events-auto bg-white/80 backdrop-blur-md shadow-lg rounded-full px-8 py-4 border border-white/20 flex items-center gap-8">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-serif uppercase tracking-widest text-stone-800 hover:text-terracotta transition-colors"
              >
                {link.name}
              </button>
            ))}
            <div className="h-6 w-px bg-sand/30" />
            <button
              onClick={() => setLocation('/dashboard/login')}
              className="text-sm font-serif uppercase tracking-widest text-terracotta hover:text-terracotta/70 transition-colors"
            >
              👑 Painel
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center justify-between w-full min-w-[200px]">
            <span className="font-serif text-stone-800 font-bold">J & A</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-transparent"
            >
              {isMobileMenuOpen ? (
                <X className="text-stone-800" />
              ) : (
                <Menu className="text-stone-800" />
              )}
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-32 px-4 md:hidden"
          >
            <div className="flex flex-col space-y-8 items-center">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-2xl font-serif text-stone-800 hover:text-terracotta transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <div className="h-px w-12 bg-sand/30" />
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setLocation('/dashboard/login');
                }}
                className="text-2xl font-serif text-terracotta hover:text-terracotta/70 transition-colors"
              >
                👑 Painel dos Noivos
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
