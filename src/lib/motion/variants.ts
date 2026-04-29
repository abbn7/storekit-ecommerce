import type { Variants, Transition } from "framer-motion";

/* ─── Easing Curves ─────────────────────────────────── */
export const ease = {
  standard: [0.2, 0, 0, 1] as const,
  emphasized: [0.2, 0.8, 0.2, 1] as const,
  decelerate: [0, 0, 0, 1] as const,
  accelerate: [0.3, 0, 1, 1] as const,
};

/* ─── Duration Presets (seconds) ────────────────────── */
export const duration = {
  instant: 0.1,
  fast: 0.15,
  base: 0.3,
  slow: 0.5,
  dramatic: 0.8,
};

/* ─── Spring Presets ────────────────────────────────── */
export const spring = {
  gentle: { type: "spring" as const, stiffness: 200, damping: 25 },
  snappy: { type: "spring" as const, stiffness: 400, damping: 30 },
  bouncy: { type: "spring" as const, stiffness: 300, damping: 20 },
};

/* ─── Shared Transitions ────────────────────────────── */
export const transition = {
  standard: { duration: duration.base, ease: ease.standard } as Transition,
  emphasized: { duration: duration.slow, ease: ease.emphasized } as Transition,
  decelerate: { duration: duration.slow, ease: ease.decelerate } as Transition,
  accelerate: { duration: duration.base, ease: ease.accelerate } as Transition,
  spring: spring.gentle,
};

/* ─── Fade Variants ─────────────────────────────────── */
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: duration.slow, ease: ease.emphasized },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.fast, ease: ease.accelerate },
  },
};

/* ─── Fade Up Variants (Primary entrance) ───────────── */
export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.emphasized },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: duration.fast, ease: ease.accelerate },
  },
};

/* ─── Fade Down Variants ────────────────────────────── */
export const fadeDownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.emphasized },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: duration.fast, ease: ease.accelerate },
  },
};

/* ─── Slide Right Variants (Cart drawer) ────────────── */
export const slideRightVariants: Variants = {
  hidden: {
    x: "100%",
  },
  visible: {
    x: 0,
    transition: { duration: duration.base, ease: ease.standard },
  },
  exit: {
    x: "100%",
    transition: { duration: duration.base, ease: ease.accelerate },
  },
};

/* ─── Slide Left Variants (Mobile menu) ─────────────── */
export const slideLeftVariants: Variants = {
  hidden: {
    x: "-100%",
  },
  visible: {
    x: 0,
    transition: { duration: duration.base, ease: ease.standard },
  },
  exit: {
    x: "-100%",
    transition: { duration: duration.base, ease: ease.accelerate },
  },
};

/* ─── Scale Fade Variants (Modals, login) ───────────── */
export const scaleFadeVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.base, ease: ease.emphasized },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: duration.fast, ease: ease.accelerate },
  },
};

/* ─── Stagger Container Variants ────────────────────── */
export const staggerContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/* ─── Stagger Item Variants ─────────────────────────── */
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: ease.emphasized,
    },
  },
};

/* ─── Micro-interaction Variants ────────────────────── */
export const hoverScale = {
  whileHover: { scale: 1.02, transition: { duration: duration.fast } },
  whileTap: { scale: 0.98, transition: { duration: duration.instant } },
};

export const hoverLift = {
  whileHover: {
    y: -4,
    transition: { duration: duration.fast, ease: ease.standard },
  },
  whileTap: { scale: 0.98, transition: { duration: duration.instant } },
};

/* ─── Overlay Backdrop Variants ─────────────────────── */
export const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: duration.base },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.fast },
  },
};
