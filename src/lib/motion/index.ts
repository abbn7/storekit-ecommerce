// Motion module — shared animation primitives
export { FadeIn } from "./FadeIn";
export { StaggerContainer } from "./StaggerContainer";
export { StaggerItem } from "./StaggerItem";
export { PageTransition } from "./PageTransition";

export {
  // Easing & duration
  ease,
  duration,
  spring,
  transition,
  // Variant collections
  fadeVariants,
  fadeUpVariants,
  fadeDownVariants,
  slideRightVariants,
  slideLeftVariants,
  scaleFadeVariants,
  staggerContainerVariants,
  staggerItemVariants,
  overlayVariants,
  // Micro-interactions
  hoverScale,
  hoverLift,
} from "./variants";
