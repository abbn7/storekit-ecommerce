"use client";

import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

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
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

        <div
          className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} isNew />
            ))}
          </div>
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/collections?sort=newest">View All New Arrivals</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
