"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react"; // I1 FIX: Import icon for placeholder
import { scaleFadeVariants, fadeUpVariants, ease, duration } from "@/lib/motion";

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
    <motion.div
      className="space-y-4"
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: duration.slow, ease: ease.emphasized }}
    >
      {/* Main image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-lg">
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
            <motion.button
              key={i}
              onClick={() => setSelectedIndex(i)}
              variants={scaleFadeVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 + i * 0.05, duration: duration.base }}
              className={cn(
                "relative w-20 h-24 overflow-hidden bg-muted border-2 transition-colors rounded-md",
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
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
