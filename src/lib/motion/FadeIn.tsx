"use client";

import { motion } from "framer-motion";
import { fadeUpVariants, fadeVariants, fadeDownVariants } from "./variants";
import type { Variants } from "framer-motion";

type FadeDirection = "up" | "down" | "none";

interface FadeInProps {
  children: React.ReactNode;
  direction?: FadeDirection;
  delay?: number;
  duration?: number;
  /** If true, animation triggers when element enters viewport */
  useViewport?: boolean;
  /** Viewport margin for triggering (e.g., "-100px") */
  viewportMargin?: string;
  className?: string;
  style?: React.CSSProperties;
}

const directionVariants: Record<FadeDirection, Variants> = {
  up: fadeUpVariants,
  down: fadeDownVariants,
  none: fadeVariants,
};

export function FadeIn({
  direction = "up",
  delay = 0,
  duration: dur,
  useViewport = true,
  viewportMargin = "-80px",
  children,
  className,
  style,
}: FadeInProps) {
  const baseVariants = directionVariants[direction];

  const customVariants: Variants = {
    ...baseVariants,
    visible: {
      ...(typeof baseVariants.visible === "object" ? baseVariants.visible : {}),
      transition: {
        ...(typeof baseVariants.visible === "object" && "transition" in (baseVariants.visible as object)
          ? (baseVariants.visible as { transition: object }).transition
          : {}),
        delay,
        ...(dur ? { duration: dur } : {}),
      },
    },
  };

  return (
    <motion.div
      variants={customVariants}
      initial="hidden"
      {...(useViewport
        ? {
            whileInView: "visible",
            viewport: { once: true, margin: viewportMargin },
          }
        : { animate: "visible" })}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
