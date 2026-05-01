"use client";

import { motion } from "framer-motion";

interface MarqueeSectionProps {
  text?: string;
}

export function MarqueeSection({ text = "Luxury • Crafted • Timeless • Essential" }: MarqueeSectionProps) {
  return (
    <section className="py-10 overflow-hidden border-y border-border/50 relative">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 accent-gradient-subtle" aria-hidden="true" />

      <div className="marquee-container relative">
        <div className="marquee-content flex items-center">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.span
              key={i}
              className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-[0.15em] uppercase text-muted-foreground/25 whitespace-nowrap mx-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {text}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
