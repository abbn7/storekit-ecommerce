"use client";

import { motion } from "framer-motion";
import { staggerContainerVariants } from "./variants";

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Stagger delay between children (default: 0.08s) */
  staggerDelay?: number;
  /** Delay before first child animates (default: 0.1s) */
  delayChildren?: number;
  /** If true, animation triggers when element enters viewport */
  useViewport?: boolean;
  viewportMargin?: string;
}

export function StaggerContainer({
  children,
  className,
  style,
  staggerDelay = 0.08,
  delayChildren = 0.1,
  useViewport = true,
  viewportMargin = "-80px",
}: StaggerContainerProps) {
  const customVariants = {
    ...staggerContainerVariants,
    visible: {
      ...staggerContainerVariants.visible,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
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
