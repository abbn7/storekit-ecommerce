"use client";

import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerContainer, StaggerItem } from "@/lib/motion";

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
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-light tracking-wide">
                New Arrivals
              </h2>
              <p className="text-muted-foreground mt-2">The latest additions to our collection</p>
            </div>
            <Link
              href="/collections?sort=newest"
              className="hidden sm:block text-xs tracking-wider uppercase hover:text-accent transition-colors"
            >
              View All →
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
