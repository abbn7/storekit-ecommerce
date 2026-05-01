"use client";

import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag, Calendar, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useUIStore } from "@/stores/uiStore";
import { formatPrice, cn } from "@/lib/utils";
import { FadeIn, hoverScale } from "@/lib/motion";
import { calculateEstimatedDelivery } from "@/lib/delivery";

interface VariantOption {
  id: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isActive: boolean;
}

interface AddToCartSectionProps {
  productId: string;
  productName: string;
  productSlug: string;
  price: number;
  compareAtPrice: number | null;
  description: string;
  material: string | null;
  careInstructions: string | null;
  imageUrl: string;
  maxStock?: number;
  variants?: VariantOption[];
}

export function AddToCartSection({
  productId,
  productName,
  productSlug,
  price,
  compareAtPrice,
  description,
  material,
  careInstructions,
  imageUrl,
  maxStock = 99,
  variants = [],
}: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.length > 0 ? variants[0]?.id ?? null : null
  );
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { openCart } = useUIStore();
  const wishlisted = isInWishlist(productId);

  // Determine active variant
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? null;

  // Use variant price/stock if a variant is selected, otherwise use product-level values
  const activePrice = selectedVariant?.price ?? price;
  const activeCompareAtPrice = selectedVariant?.compareAtPrice ?? compareAtPrice;
  const activeMaxStock = selectedVariant?.stock ?? maxStock;
  const activeVariantName = selectedVariant?.name ?? null;

  const isOnSale = activeCompareAtPrice != null && activeCompareAtPrice > activePrice;
  const discount = isOnSale
    ? Math.round(((activeCompareAtPrice - activePrice) / activeCompareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    // H4 FIX: Validate quantity doesn't exceed stock
    if (quantity > activeMaxStock) return;
    addToCart({
      product_id: productId,
      product_name: productName,
      product_slug: productSlug,
      variant_id: selectedVariantId,
      variant_name: activeVariantName,
      price: activePrice,
      compare_at_price: activeCompareAtPrice,
      quantity,
      image_url: imageUrl,
      max_stock: activeMaxStock,
    });
    openCart();
  };

  const handleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        product_id: productId,
        product_name: productName,
        product_slug: productSlug,
        price: activePrice,
        image_url: imageUrl,
      });
    }
  };

  return (
    <FadeIn delay={0.15} className="space-y-6">
      {/* Title & Price */}
      <div>
        <h1 className="font-heading text-3xl sm:text-4xl font-light tracking-wide">
          {productName}
        </h1>
        <div className="flex items-center gap-3 mt-3">
          <span className={cn("text-xl", isOnSale && "text-destructive font-medium")}>
            {formatPrice(activePrice)}
          </span>
          {isOnSale && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(activeCompareAtPrice!)}
              </span>
              <span className="text-xs font-medium bg-destructive/10 text-destructive px-2 py-0.5 rounded">
                -{discount}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Material */}
      {material && (
        <div className="text-sm">
          <span className="font-medium">Material:</span>{" "}
          <span className="text-muted-foreground">{material}</span>
        </div>
      )}

      {/* Variant Selection */}
      {variants.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium">
            {selectedVariant?.name ? `Selected: ${selectedVariant.name}` : "Select an option"}
          </span>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariantId(variant.id)}
                disabled={!variant.isActive || variant.stock <= 0}
                className={cn(
                  "px-4 py-2 text-sm border transition-colors",
                  selectedVariantId === variant.id
                    ? "border-foreground bg-foreground text-background"
                    : "border-muted hover:border-foreground/50",
                  (!variant.isActive || variant.stock <= 0) && "opacity-50 cursor-not-allowed line-through"
                )}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Quantity</span>
        <div className="flex items-center border">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-muted transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(activeMaxStock, quantity + 1))}
            disabled={quantity >= activeMaxStock}
            className="p-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {activeMaxStock < 10 && (
          <span className="text-xs text-muted-foreground">Only {activeMaxStock} left</span>
        )}

        {/* Estimated Delivery */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Truck className="h-4 w-4 text-accent flex-shrink-0" />
          <span>Estimated delivery: <span className="text-foreground font-medium">{calculateEstimatedDelivery().rangeLabel}</span></span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <motion.div
          className="flex-1"
          whileHover={hoverScale.whileHover}
          whileTap={hoverScale.whileTap}
        >
          <Button
            onClick={handleAddToCart}
            className="w-full py-6 text-xs tracking-wider uppercase accent-gradient text-white hover:opacity-90 transition-opacity"
            disabled={activeMaxStock <= 0}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            {activeMaxStock <= 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </motion.div>
        <motion.div
          whileHover={hoverScale.whileHover}
          whileTap={hoverScale.whileTap}
        >
          <Button
            variant="outline"
            size="icon"
            className="h-auto py-6 px-4"
            onClick={handleWishlist}
          >
            <Heart
              className={cn(
                "h-5 w-5",
                wishlisted ? "fill-destructive text-destructive" : ""
              )}
            />
          </Button>
        </motion.div>
      </div>

      {/* Care instructions */}
      {careInstructions && (
        <div className="pt-6 border-t">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Care:</span>{" "}
            {careInstructions}
          </p>
        </div>
      )}
    </FadeIn>
  );
}
