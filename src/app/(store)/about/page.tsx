"use client";

import Image from "next/image";
import { FadeIn, StaggerContainer, StaggerItem } from "@/lib/motion";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Gem, Leaf, Heart, Award } from "lucide-react";

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const values = [
    {
      icon: Gem,
      title: "Craftsmanship",
      description: "Every piece is meticulously crafted by skilled artisans using time-honored techniques passed down through generations.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "We are committed to ethical sourcing, sustainable materials, and minimizing our environmental footprint at every step.",
    },
    {
      icon: Heart,
      title: "Intention",
      description: "Each design begins with purpose — creating pieces that are not just beautiful, but meaningful and enduring.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We hold ourselves to the highest standards of quality, from the materials we select to the finishing touches we apply.",
    },
  ];

  return (
    <>
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ y: bgY }}
        >
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop"
            alt="Our Story"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-background" />

        <motion.div
          className="relative z-10 flex items-center justify-center h-full px-4"
          style={{ opacity }}
        >
          <div className="text-center">
            <span className="text-xs tracking-[0.2em] uppercase text-white/60 mb-4 block">
              Our Story
            </span>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-light tracking-wide text-white">
              About MAISON
            </h1>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground text-center">
              Founded with a passion for timeless elegance and uncompromising quality,
              our brand represents the intersection of heritage craftsmanship and modern design.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="py-16 text-center">
              <blockquote className="font-heading text-3xl sm:text-4xl font-light italic tracking-wide accent-gradient-text">
                &ldquo;Quality is not an act, it is a habit.&rdquo;
              </blockquote>
              <p className="text-sm text-muted-foreground mt-4">— Aristotle</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground text-center">
              Every piece in our collection is meticulously crafted using premium materials
              sourced from the world's finest suppliers. We believe that true luxury lies
              in the details — the hand-finished seams, the carefully selected fabrics,
              and the thoughtful design that ensures each item stands the test of time.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground text-center mt-8">
              Our commitment extends beyond our products. We are dedicated to sustainable
              practices, ethical sourcing, and supporting the artisans who bring our vision
              to life. When you choose our brand, you choose a legacy of excellence.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 lg:py-28 bg-muted/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-accent/5 blur-3xl -translate-y-1/2 -translate-x-1/2" aria-hidden="true" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 block">
                Philosophy
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide">
                Our Values
              </h2>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <div className="glass-panel-strong rounded-2xl p-8 text-center h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                    <value.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-heading text-2xl tracking-wide mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="font-heading text-3xl sm:text-4xl font-light tracking-wide mb-6">
              Experience the Difference
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Discover our curated collections and find pieces that speak to your style.
            </p>
            <a
              href="/collections"
              className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-lg text-xs tracking-[0.2em] uppercase font-medium hover:bg-foreground/90 transition-colors"
            >
              Explore Collections
            </a>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
