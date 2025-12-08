import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  fullWidth?: boolean;
}

export default function FadeIn({ 
  children, 
  delay = 0, 
  direction = "up", 
  className = "",
  fullWidth = false
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10% 0px -10% 0px" });

  const getDirectionOffset = () => {
    switch (direction) {
      case "up": return { y: 40, x: 0 };
      case "down": return { y: -40, x: 0 };
      case "left": return { x: 40, y: 0 };
      case "right": return { x: -40, y: 0 };
      case "none": return { x: 0, y: 0 };
      default: return { y: 40, x: 0 };
    }
  };

  const initial = { 
    opacity: 0, 
    ...getDirectionOffset() 
  };

  const animate = isInView ? { 
    opacity: 1, 
    x: 0, 
    y: 0 
  } : { 
    opacity: 0, 
    ...getDirectionOffset() 
  };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98] as any // Cast to any to avoid strict type checking issues with framer-motion versions
      }}
      className={className}
      style={{ width: fullWidth ? "100%" : "auto" }}
    >
      {children}
    </motion.div>
  );
}
