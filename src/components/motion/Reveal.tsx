"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Subtle blur → sharp while entering view */
  blur?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  blur = false,
}: RevealProps) {
  return (
    <motion.div
      initial={
        blur ? { opacity: 0, y, filter: "blur(10px)" } : { opacity: 0, y }
      }
      whileInView={
        blur ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 1, y: 0 }
      }
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: blur ? 0.52 : 0.42,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
