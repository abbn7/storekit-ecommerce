"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";
import { ImageZoom } from "@/components/store/ImageZoom";
import { fadeUpVariants, scaleFadeVariants, ease, duration } from "@/lib/motion";

interface ProductImage {
  url: string;
  altText: string | null;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
}

const imageVariants = {
  initial: { opacity: 0, scale: 1.02 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] as const } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: [0.3, 0, 1, 1] as const } },
};

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

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
      {/* Main image with zoom */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-xl group">
        <AnimatePresence mode="wait">
          {displayImages[selectedIndex]?.url ? (
            <motion.div
              key={selectedIndex}
              variants={imageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0"
            >
              <ImageZoom
                src={displayImages[selectedIndex].url}
                alt={displayImages[selectedIndex].altText || "Product image"}
                className="w-full h-full"
                zoomScale={2.5}
              />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
              <Package className="h-16 w-16" />
              <p className="text-sm">No image available</p>
            </div>
          )}
        </AnimatePresence>
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
                "relative w-20 h-24 overflow-hidden bg-muted border-2 transition-all duration-300 rounded-lg",
                selectedIndex === i
                  ? "border-foreground ring-1 ring-foreground/20"
                  : "border-transparent hover:border-muted-foreground/30"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
