"use client";

import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerContainer, StaggerItem } from "@/lib/motion";
import { ArrowRight } from "lucide-react";

interface NewArrivalsProps {
  products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    images: { url: string; alt_text: string | null; is_primary: boolean }[];
    isNew?: boolean;
  }[];
}

export function NewArrivals({ products }: NewArrivalsProps) {
  return (
    <section className="py-20 lg:py-28 bg-muted/30 relative overflow-hidden">
      {/* Subtle decorative element */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/5 blur-3xl -translate-y-1/2 translate-x-1/2" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <FadeIn>
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 block">
                Just In
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide">
                New Arrivals
              </h2>
              <p className="text-muted-foreground mt-2">The latest additions to our collection</p>
            </div>
            <Link
              href="/collections?sort=newest"
              className="hidden sm:flex items-center gap-2 text-xs tracking-wider uppercase hover:text-accent transition-colors group"
            >
              View All
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard {...product} isNew />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="mt-10 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/collections?sort=newest">View All New Arrivals</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
