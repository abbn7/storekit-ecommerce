"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

// ─── Types ─────────────────────────────────────────────
export interface HeroBanner {
  id?: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  ctaText?: string | null;
  ctaLink?: string | null;
}

interface HeroSectionProps {
  banners: HeroBanner[];
}

// ─── Constants ─────────────────────────────────────────
const AUTO_ROTATE_MS = 6000;
const PARALLAX_RANGE = 150;

// ─── Animation Variants ───────────────────────────────

/** Slide crossfade for carousel backgrounds */
const slideVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 1, ease: [0.2, 0.8, 0.2, 1] as const },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.6, ease: [0.3, 0, 1, 1] as const },
  },
};

/** Per-character reveal for titles */
const charVariants = {
  hidden: { opacity: 0, y: 30, rotateX: -40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.5,
      ease: [0.2, 0.8, 0.2, 1] as const,
      delay: 0.4 + i * 0.03,
    },
  }),
};

/** Subtitle mask reveal */
const subtitleVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const, delay: 0.9 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/** CTA button entrance */
const ctaVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as const, delay: 1.2 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/** Scroll indicator fade-in */
const scrollVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, delay: 1.8 } },
};

// ─── Sub-Components ────────────────────────────────────

/** Character-by-character animated title */
function AnimatedTitle({ text, className }: { text: string; className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <h1 className={className}>{text}</h1>;
  }

  const words = text.split(" ");
  let charIndex = 0;

  return (
    <h1 className={className} style={{ perspective: "600px" }}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-flex overflow-hidden mr-[0.3em]">
          {word.split("").map((char) => {
            const idx = charIndex++;
            return (
              <motion.span
                key={`${wordIdx}-${idx}`}
                custom={idx}
                variants={charVariants}
                initial="hidden"
                animate="visible"
                className="inline-block"
                style={{ transformOrigin: "bottom center" }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

/** Carousel dot indicators with progress fill */
function CarouselDots({
  total,
  current,
  interval,
  isPaused,
  onSelect,
}: {
  total: number;
  current: number;
  interval: number;
  isPaused: boolean;
  onSelect: (i: number) => void;
}) {
  if (total <= 1) return null;

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className="relative h-1 rounded-full overflow-hidden bg-white/30 transition-all duration-300 hover:bg-white/50 focus-ring"
          style={{ width: i === current ? "32px" : "8px" }}
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === current ? "true" : undefined}
        >
          {i === current && !isPaused && (
            <motion.div
              className="absolute inset-0 bg-white rounded-full origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: interval / 1000, ease: "linear" }}
              key={`progress-${current}`}
            />
          )}
        </button>
      ))}
    </div>
  );
}

/** Bouncing scroll-down indicator */
function ScrollIndicator() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={scrollVariants}
      initial="hidden"
      animate="visible"
      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5"
    >
      <span className="text-white/50 text-[10px] tracking-[0.2em] uppercase font-medium select-none">
        Scroll
      </span>
      <ChevronDown
        className={`w-4 h-4 text-white/50 ${
          prefersReducedMotion ? "" : "animate-scroll-bounce"
        }`}
      />
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────

export function HeroSection({ banners }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // ── Scroll-linked parallax ────────────────────────
  const { scrollY } = useScroll();
  const bgY = useTransform(
    scrollY,
    [0, 600],
    [0, prefersReducedMotion ? 0 : PARALLAX_RANGE]
  );
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const contentScale = useTransform(scrollY, [0, 400], [1, prefersReducedMotion ? 1 : 0.95]);

  // ── Auto-rotate carousel ──────────────────────────
  useEffect(() => {
    if (isPaused || banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [isPaused, banners.length]);

  // ── Track image load per slide ────────────────────
  useEffect(() => {
    setImageLoaded(false);
  }, [currentIndex]);

  const current = banners[currentIndex];
  if (!current) return null;

  // Alternate Ken Burns direction per slide for variety
  const kenBurnsClass = prefersReducedMotion
    ? ""
    : currentIndex % 2 === 0
      ? "animate-ken-burns"
      : "animate-ken-burns-alt";

  return (
    <section
      className="relative h-[100vh] min-h-[600px] max-h-[1000px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      role="region"
      aria-label="Hero banner"
      aria-roledescription="carousel"
    >
      {/* ── Parallax Background Container ──────────────── */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: bgY }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id || `slide-${currentIndex}`}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0"
          >
            {/* Blur-up placeholder (dark scrim while image loads) */}
            <div
              className={`absolute inset-0 z-[1] bg-black/50 transition-opacity duration-700 ${
                imageLoaded ? "opacity-0" : "opacity-100"
              }`}
              aria-hidden="true"
            />

            {/* Background image with Ken Burns cinematic effect */}
            <Image
              src={current.imageUrl}
              alt=""
              fill
              className={`object-cover transition-opacity duration-700 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              } ${kenBurnsClass}`}
              priority={currentIndex === 0}
              sizes="100vw"
              onLoad={() => setImageLoaded(true)}
              role="presentation"
            />
          </motion.div>
        </AnimatePresence>

        {/* Multi-layer gradient overlay for depth & readability */}
        <div
          className="absolute inset-0 z-[2] bg-gradient-to-b from-black/20 via-black/30 to-black/60"
          aria-hidden="true"
        />
      </motion.div>

      {/* ── Content with Scroll Parallax ───────────────── */}
      <motion.div
        className="relative z-10 flex items-center justify-center h-full px-4"
        style={{ opacity: contentOpacity, scale: contentScale }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id || `content-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-2xl w-full"
          >
            {/* ── Glass Morphism Content Card ──────────── */}
            <div className="rounded-2xl px-8 py-10 sm:px-12 sm:py-12 bg-white/[0.08] backdrop-blur-[18px] border border-white/[0.15] shadow-[0_14px_40px_rgba(0,0,0,0.2)]">
              {/* Character-by-character animated title */}
              <AnimatedTitle
                text={current.title}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light tracking-wide mb-4 text-white"
              />

              {/* Subtitle with mask reveal */}
              {current.subtitle && (
                <motion.p
                  variants={subtitleVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-base sm:text-lg font-light tracking-wide text-white/75 mb-8 max-w-lg mx-auto"
                >
                  {current.subtitle}
                </motion.p>
              )}

              {/* CTA button */}
              {current.ctaLink && (
                <motion.div
                  variants={ctaVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-foreground hover:bg-white/90 px-8 py-6 text-xs tracking-[0.2em] uppercase font-medium rounded-lg shadow-lg"
                  >
                    <Link href={current.ctaLink}>
                      {current.ctaText || "Shop Now"}
                    </Link>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ── Carousel Progress Dots ─────────────────────── */}
      <CarouselDots
        total={banners.length}
        current={currentIndex}
        interval={AUTO_ROTATE_MS}
        isPaused={isPaused}
        onSelect={setCurrentIndex}
      />

      {/* ── Scroll Down Indicator ──────────────────────── */}
      <ScrollIndicator />

      {/* ── Bottom Gradient Fade ───────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
