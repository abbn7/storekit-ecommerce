"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImage {
  url: string;
  altText: string | null;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fallback placeholder if no images
  const displayImages = images.length > 0
    ? images
    : [{ url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop", altText: "Product image" }];

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {displayImages[selectedIndex] ? (
          <Image
            src={displayImages[selectedIndex].url}
            alt={displayImages[selectedIndex].altText || "Product image"}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No image available
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative w-20 h-24 overflow-hidden bg-muted border-2 transition-colors",
                selectedIndex === i ? "border-foreground" : "border-transparent"
              )}
            >
              <Image
                src={img.url}
                alt={img.altText || `Product thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
