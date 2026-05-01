"use client";

import { ProductCard } from "./ProductCard";
import { FadeIn, StaggerContainer, StaggerItem } from "@/lib/motion";
import Link from "next/link";

interface RelatedProductsProps {
  products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    images: { url: string; alt_text: string | null; is_primary: boolean }[];
    isNew?: boolean;
    isFeatured?: boolean;
  }[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-20 pt-12 border-t">
      <FadeIn>
        <div className="text-center mb-10">
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 block">
            You May Also Like
          </span>
          <h2 className="font-heading text-3xl font-light tracking-wide">
            Related Products
          </h2>
        </div>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <StaggerItem key={product.id}>
            <ProductCard {...product} />
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeIn delay={0.2}>
        <div className="text-center mt-10">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors border-b border-foreground/20 hover:border-foreground pb-0.5"
          >
            View All Collections
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
