"use client";

import { FadeIn } from "@/lib/motion";

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="font-heading text-5xl font-light tracking-wide text-center mb-16">
            Our Story
          </h1>
        </FadeIn>

        <div className="prose prose-lg max-w-none space-y-8">
          <FadeIn delay={0.1}>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Founded with a passion for timeless elegance and uncompromising quality,
              our brand represents the intersection of heritage craftsmanship and modern design.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Every piece in our collection is meticulously crafted using premium materials
              sourced from the world's finest suppliers. We believe that true luxury lies
              in the details — the hand-finished seams, the carefully selected fabrics,
              and the thoughtful design that ensures each item stands the test of time.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="py-12 text-center">
              <blockquote className="font-heading text-3xl font-light italic tracking-wide accent-gradient-text">
                &ldquo;Quality is not an act, it is a habit.&rdquo;
              </blockquote>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Our commitment extends beyond our products. We are dedicated to sustainable
              practices, ethical sourcing, and supporting the artisans who bring our vision
              to life. When you choose our brand, you choose a legacy of excellence.
            </p>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
