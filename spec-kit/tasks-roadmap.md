# Tasks Roadmap (v2)

## Completed
- Phase 1: Product discovery and gap analysis.
- Phase 2: Finalized requirements and quality attributes.
- Phase 3: Architecture, interfaces, naming, and folder standards.
- Phase 4: API and database specs.
- Phase 5: Frontend design-system and motion/theming/navigation strategy.
- Phase 6a: spec-kit documentation update (requirements v2, architecture v2, design-system v2, motion-guidelines v2, theming-strategy v2, navigation-access v2).

## In Progress
- Phase 6b: Color System & Design Tokens (globals.css overhaul)
  - Add gradient tokens, surface elevation tokens, glass level tokens.
  - Add motion duration/easing tokens.
  - Add radius scale tokens.
  - Ensure dark mode completeness.
  - Add shimmer/skeleton animation tokens.

## Upcoming
- Phase 6c: Animation Infrastructure (Framer Motion)
  - Create `src/lib/motion/` module with shared animation primitives.
  - Create `MotionWrapper`, `FadeIn`, `StaggerContainer`, `StaggerItem` components.
  - Create `ScrollReveal` component using Framer Motion's `useInView`.
  - Create `PageTransition` component using Framer Motion's `AnimatePresence`.
  - Create micro-interaction variants (hover, tap, focus).

- Phase 6d: Dashboard Access & Navigation Fix
  - Add Dashboard icon button to Navbar.
  - Add Dashboard link to Footer.
  - Add Dashboard link to Mobile Menu.
  - Redesign Admin Login page with glass/iOS aesthetic.
  - Improve Admin Sidebar with glass treatment.

- Phase 6e: Core Storefront Components Upgrade
  - Upgrade Navbar with enhanced glass + animation.
  - Upgrade HeroSection with parallax + staggered text animation.
  - Upgrade FeaturedCollections with glass overlays + hover animations.
  - Upgrade MarqueeSection with gradient fade edges.
  - Upgrade NewArrivals with staggered grid animation.
  - Upgrade TestimonialsSection with glass cards + scroll reveal.
  - Upgrade ProductCard with glass hover overlay + micro-interactions.
  - Upgrade AnnouncementBar with smooth enter/exit.
  - Upgrade Footer with glass treatment + animated social icons.

- Phase 6f: Page-Level Upgrades
  - Upgrade About page with glass sections + scroll animations.
  - Upgrade Collections page with staggered grid + glass overlays.
  - Upgrade Collection Detail page with animated header.
  - Upgrade Product Detail page with image animation + add-to-cart feedback.
  - Upgrade Cart page with glass panels + item animations.
  - Upgrade Checkout page with step animations.
  - Upgrade Account pages with glass cards + transitions.
  - Upgrade Order Confirmation page with success animation.
  - Upgrade 404 page with animated illustration.
  - Upgrade Loading states with glass shimmer skeletons.

- Phase 6g: Overlay & Interaction Polish
  - Upgrade CartDrawer with Framer Motion animations.
  - Upgrade MobileMenu with Framer Motion sheet animation.
  - Upgrade SearchOverlay with Framer Motion enter/exit.
  - Add page transition wrapper to store layout.
  - Add back-to-top button with smooth scroll.
  - Add micro-interactions to all buttons and interactive elements.

- Phase 7: Verification & Self-Correction
  - Run `pnpm build` and fix any errors.
  - Test all critical user flows.
  - Verify dark mode consistency.
  - Verify mobile responsiveness.
  - Check for animation performance issues.
  - Verify admin dashboard access end-to-end.
  - Cross-browser testing notes.
  - Final verification report.

## Remaining
- Deployment and verification reports.
