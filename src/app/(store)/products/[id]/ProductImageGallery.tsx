"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react"; // I1 FIX: Import icon for placeholder

interface ProductImage {
  url: string;
  altText: string | null;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // I1 FIX: Use styled placeholder instead of Unsplash fallback
  const displayImages = images.length > 0
    ? images
    : [{ url: "", altText: "No image available" }];

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {displayImages[selectedIndex]?.url ? (
          <Image
            src={displayImages[selectedIndex].url}
            alt={displayImages[selectedIndex].altText || "Product image"}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
            <Package className="h-16 w-16" />
            <p className="text-sm">No image available</p>
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
              {img.url ? (
                <Image
                  src={img.url}
                  alt={img.altText || `Product thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
