# Motion Guidelines (Framer Motion)

## Motion Principles
- Motion supports hierarchy and feedback, never decoration-only noise.
- Keep transitions smooth, brief, and consistent.
- Premium feel: subtle movements, not flashy animations.
- iOS-inspired: elements respond to user intent with physical realism.

## Motion Token Scale

### Duration
| Token | Value | Usage |
|-------|-------|-------|
| `--motion-instant` | 100ms | Hover color changes, focus rings |
| `--motion-fast` | 150ms | Micro-interactions, button presses |
| `--motion-base` | 300ms | Standard transitions, drawer slides |
| `--motion-slow` | 500ms | Scroll reveal, page transitions |
| `--motion-dramatic` | 800ms | Hero text reveal, major section entrances |

### Easing
| Token | Value | Usage |
|-------|-------|-------|
| `--ease-standard` | `[0.2, 0, 0, 1]` | General transitions |
| `--ease-emphasized` | `[0.2, 0.8, 0.2, 1]` | Entrances, reveals |
| `--ease-decelerate` | `[0, 0, 0, 1]` | Elements entering viewport |
| `--ease-accelerate` | `[0.3, 0, 1, 1]` | Elements leaving viewport |
| `--ease-spring` | `{ stiffness: 300, damping: 30 }` | Playful micro-interactions |

## Framer Motion Variant System

### Fade Variants
```typescript
const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: [0.3, 0, 1, 1] } },
};
```

### Fade Up Variants (Primary entrance)
```typescript
const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: [0.3, 0, 1, 1] } },
};
```

### Slide Variants (Drawers, menus)
```typescript
const slideRightVariants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] } },
  exit: { x: "100%", transition: { duration: 0.25, ease: [0.3, 0, 1, 1] } },
};

const slideLeftVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] } },
  exit: { x: "-100%", transition: { duration: 0.25, ease: [0.3, 0, 1, 1] } },
};
```

### Scale Variants (Micro-interactions)
```typescript
const scaleVariants = {
  hover: { scale: 1.02, transition: { duration: 0.15 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};
```

### Stagger Variants (Lists, grids)
```typescript
const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] },
  },
};
```

## Component Animation Mapping

| Component | Animation Type | Variant | Trigger |
|-----------|---------------|---------|---------|
| Navbar | Glass transition | CSS transition | Scroll position |
| HeroSection | Staggered fade-up | `fadeUpVariants` + stagger | Page load |
| FeaturedCollections | Scroll reveal + hover scale | `fadeUpVariants` + `scaleVariants` | Viewport |
| MarqueeSection | CSS marquee (continuous) | CSS keyframe | Always |
| NewArrivals | Stagger grid | `staggerContainerVariants` | Viewport |
| TestimonialsSection | Scroll reveal | `fadeUpVariants` | Viewport |
| ProductCard | Hover scale + quick-add slide | `scaleVariants` + CSS | Hover |
| CartDrawer | Slide from right | `slideRightVariants` | Toggle |
| MobileMenu | Slide from left | `slideLeftVariants` | Toggle |
| SearchOverlay | Fade + scale down | `fadeVariants` + scale | Toggle |
| AnnouncementBar | Slide down | `fadeVariants` | Page load |
| Footer | Scroll reveal | `fadeUpVariants` | Viewport |
| Page transitions | Fade + slight Y shift | `fadeUpVariants` | Route change |
| Admin Login | Center scale-in | scale + fade | Page load |
| BackToTop | Fade + slide up | `fadeVariants` | Scroll position |

## Usage Rules
- Use shared motion primitives from `src/lib/motion/` for all animations.
- Avoid per-component arbitrary durations unless justified by interaction type.
- Keep entrance/exit distances subtle (max 20px translate) for premium feel.
- Stagger delay between list items: 0.08s (elegant cascade).
- All overlay animations (cart, menu, search) must use Framer Motion `AnimatePresence`.
- Page transitions must use `AnimatePresence` with `mode="wait"`.

## Performance Rules
- Animate only `transform` and `opacity` (GPU-composited properties).
- Never animate `width`, `height`, `top`, `left`, `margin`, `padding`.
- Use `layoutId` for shared layout animations sparingly.
- Use `will-change: transform` only on elements about to animate, remove after.
- Lazy-load below-fold animation components.

## Reduced Motion
- Respect `prefers-reduced-motion` media query.
- Disable marquee animation under reduced-motion mode.
- Replace all transform animations with simple opacity fades.
- Reduce duration to instant (100ms) for essential feedback only.
- Framer Motion: use `useReducedMotion()` hook to conditionally disable.
