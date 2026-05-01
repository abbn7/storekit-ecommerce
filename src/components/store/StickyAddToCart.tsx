"use client";

import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface StickyAddToCartProps {
  productName: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string;
  productId: string;
  productSlug: string;
  maxStock: number;
}

export function StickyAddToCart({
  productName,
  price,
  compareAtPrice,
  imageUrl,
  productId,
  productSlug,
  maxStock,
}: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past the main add-to-cart section
      setVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isOnSale = compareAtPrice != null && compareAtPrice > price;

  const handleQuickAdd = () => {
    addItem({
      product_id: productId,
      product_name: productName,
      product_slug: productSlug,
      variant_id: null,
      variant_name: null,
      price,
      compare_at_price: compareAtPrice,
      quantity: 1,
      image_url: imageUrl,
      max_stock: maxStock,
    });
    openCart();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-40 lg:hidden glass-panel-strong border-t border-border/50 safe-area-bottom"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Product image thumbnail */}
            <div className="relative h-12 w-10 flex-shrink-0 bg-muted rounded-md overflow-hidden">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Product info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{productName}</p>
              <div className="flex items-center gap-2">
                <span className={cn("text-sm", isOnSale && "text-destructive font-medium")}>
                  {formatPrice(price)}
                </span>
                {isOnSale && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(compareAtPrice!)}
                  </span>
                )}
              </div>
            </div>

            {/* Add to cart button */}
            <Button
              onClick={handleQuickAdd}
              className="accent-gradient text-white hover:opacity-90 transition-opacity px-5 py-2.5 text-xs tracking-wider uppercase flex-shrink-0"
            >
              <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
              Add to Bag
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

