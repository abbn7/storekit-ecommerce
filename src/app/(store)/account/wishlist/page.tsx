"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlistStore";
import { ProductCard } from "@/components/store/ProductCard";
import { FadeIn, StaggerContainer, StaggerItem } from "@/lib/motion";

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link href="/account" className="hover:text-foreground transition-colors">Account</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Wishlist</span>
        </nav>
        <FadeIn>
          <h1 className="font-heading text-4xl font-light tracking-wide mb-12">Wishlist</h1>
        </FadeIn>

        {items.length === 0 ? (
          <FadeIn>
            <div className="glass-panel rounded-2xl text-center py-20 px-8">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
              <Link href="/collections" className="text-sm accent-gradient-text hover:opacity-80 transition-opacity">Explore collections</Link>
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <StaggerItem key={item.product_id}>
                <ProductCard
                  id={item.product_id}
                  name={item.product_name}
                  slug={item.product_slug}
                  price={item.price}
                  compareAtPrice={null}
                  images={[{ url: item.image_url, alt_text: item.product_name, is_primary: true }]}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
