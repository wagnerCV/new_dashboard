import { useEffect, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEventSettings } from "@/contexts/EventContext";
import FadeIn from "./FadeIn";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Memoized TimeUnit to prevent unnecessary re-renders of static numbers
const TimeUnit = memo(({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center mx-2 md:mx-6">
    <div className="relative h-10 md:h-14 w-16 md:w-20 overflow-hidden flex justify-center">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={value}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5 }}
          className="absolute font-serif text-3xl md:text-5xl text-terracotta font-medium"
        >
          {value < 10 ? `0${value}` : value}
        </motion.div>
      </AnimatePresence>
    </div>
    <span className="text-xs md:text-sm font-sans uppercase tracking-widest text-muted-foreground mt-2">
      {label}
    </span>
  </div>
));

export default function Countdown() {
  const { settings } = useEventSettings();

  const calculateTimeLeft = (targetDate: string): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(settings.countdown_target));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(settings.countdown_target));
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.countdown_target]);

  return (
    <div className="w-full py-12 md:py-20 bg-off-white flex justify-center items-center border-b border-sand/20">
      <FadeIn>
        <div className="flex flex-wrap justify-center items-center">
          <TimeUnit value={timeLeft.days} label="Dias" />
          <span className="text-2xl md:text-4xl text-sand font-serif mb-6">:</span>
          <TimeUnit value={timeLeft.hours} label="Horas" />
          <span className="text-2xl md:text-4xl text-sand font-serif mb-6">:</span>
          <TimeUnit value={timeLeft.minutes} label="Minutos" />
          <span className="text-2xl md:text-4xl text-sand font-serif mb-6">:</span>
          <TimeUnit value={timeLeft.seconds} label="Segundos" />
        </div>
      </FadeIn>
    </div>
  );
}
