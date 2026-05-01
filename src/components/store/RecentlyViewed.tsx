"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { FadeIn, StaggerContainer, StaggerItem } from "@/lib/motion";

interface RecentlyViewedItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string;
}

interface RecentlyViewedProps {
  currentProductId?: string;
}

const STORAGE_KEY = "storekit-recently-viewed";
const MAX_ITEMS = 8;

export function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: RecentlyViewedItem[] = JSON.parse(stored);
        // Filter out current product
        const filtered = currentProductId
          ? parsed.filter((item) => item.id !== currentProductId)
          : parsed;
        setItems(filtered.slice(0, MAX_ITEMS));
      }
    } catch {
      // Ignore parse errors
    }
  }, [currentProductId]);

  if (items.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t">
      <FadeIn>
        <div className="text-center mb-10">
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 block">
            Previously Viewed
          </span>
          <h2 className="font-heading text-2xl font-light tracking-wide">
            Recently Viewed
          </h2>
        </div>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <StaggerItem key={item.id}>
            <Link href={`/products/${item.slug}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-xl mb-3">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <Package className="h-8 w-8" />
                  </div>
                )}
              </div>
              <h3 className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                {item.name}
              </h3>
              <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

/** Call this to add a product to recently viewed (use in product detail page) */
export function addRecentlyViewed(item: RecentlyViewedItem) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const existing: RecentlyViewedItem[] = stored ? JSON.parse(stored) : [];

    // Remove if already exists (will re-add at top)
    const filtered = existing.filter((i) => i.id !== item.id);

    // Add to front
    filtered.unshift(item);

    // Cap at max
    const capped = filtered.slice(0, MAX_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
  } catch {
    // Ignore storage errors
  }
}
