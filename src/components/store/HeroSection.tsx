"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { fadeUpVariants, duration, ease } from "@/lib/motion";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function HeroSection({
  title = "The New Collection",
  subtitle = "Timeless pieces crafted with intention",
  imageUrl = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop",
  ctaText = "Shop Now",
  ctaLink = "/collections",
}: HeroSectionProps) {
  return (
    <section className="relative h-[100vh] min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background image */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white max-w-2xl px-4">
          <motion.h1
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: duration.slow, ease: ease.emphasized, delay: 0.2 }}
            className="font-heading text-5xl sm:text-6xl lg:text-7xl font-light tracking-wide mb-4"
          >
            {title}
          </motion.h1>
          <motion.p
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: duration.slow, ease: ease.emphasized, delay: 0.4 }}
            className="text-lg sm:text-xl font-light tracking-wide text-white/80 mb-8"
          >
            {subtitle}
          </motion.p>
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: duration.slow, ease: ease.emphasized, delay: 0.6 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-foreground hover:bg-white/90 px-8 py-6 text-xs tracking-[0.2em] uppercase font-medium rounded-lg"
            >
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
