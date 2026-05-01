"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

interface CollectionHeaderProps {
  name: string;
  description: string | null;
  imageUrl?: string | null;
}

export function CollectionHeader({ name, description, imageUrl }: CollectionHeaderProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  return (
    <section ref={ref} className="relative h-[40vh] min-h-[300px] max-h-[500px] overflow-hidden">
      {imageUrl ? (
        <>
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={{ y: bgY }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              className="w-full h-full object-cover"
              role="presentation"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-background" />
        </>
      ) : (
        <div className="absolute inset-0 bg-muted">
          <div className="absolute inset-0 accent-gradient-subtle" />
        </div>
      )}

      <motion.div
        className="relative z-10 flex items-center justify-center h-full px-4"
        style={{ opacity, scale }}
      >
        <div className="text-center">
          {imageUrl ? (
            <>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide text-white mb-4">
                {name}
              </h1>
              {description && (
                <p className="text-white/70 max-w-xl mx-auto text-lg font-light">
                  {description}
                </p>
              )}
            </>
          ) : (
            <div className="glass-panel-strong rounded-2xl px-10 py-8 inline-block">
              <h1 className="font-heading text-4xl sm:text-5xl font-light tracking-wide mb-4">
                {name}
              </h1>
              {description && (
                <p className="text-muted-foreground max-w-xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
