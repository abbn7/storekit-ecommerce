"use client";

import { motion } from "framer-motion";
import { staggerItemVariants } from "./variants";

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function StaggerItem({ children, className, style }: StaggerItemProps) {
  return (
    <motion.div
      variants={staggerItemVariants}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
