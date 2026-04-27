"use client";

import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useUIStore } from "@/stores/uiStore";
import { formatPrice, cn } from "@/lib/utils";

export function AddToCartSection({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { openCart } = useUIStore();
  const wishlisted = isInWishlist(productId);

  // Placeholder product data
  const product = {
    name: "Classic Essential Piece",
    slug: productId,
    price: 18500,
    compareAtPrice: 22000,
    description: "Meticulously crafted with premium materials. This piece embodies our commitment to quality and timeless design. Each detail has been considered to ensure lasting elegance.",
    material: "100% Organic Cotton",
    careInstructions: "Machine wash cold, tumble dry low",
  };

  const isOnSale = product.compareAtPrice > product.price;
  const discount = isOnSale
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({
      product_id: productId,
      product_name: product.name,
      product_slug: product.slug,
      variant_id: null,
      variant_name: null,
      price: product.price,
      compare_at_price: product.compareAtPrice,
      quantity,
      image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop",
      max_stock: 99,
    });
    openCart();
  };

  const handleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        product_id: productId,
        product_name: product.name,
        product_slug: product.slug,
        price: product.price,
        image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Price */}
      <div>
        <h1 className="font-heading text-3xl sm:text-4xl font-light tracking-wide">
          {product.name}
        </h1>
        <div className="flex items-center gap-3 mt-3">
          <span className={cn("text-xl", isOnSale && "text-destructive font-medium")}>
            {formatPrice(product.price)}
          </span>
          {isOnSale && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
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
        {product.description}
      </p>

      {/* Material */}
      {product.material && (
        <div className="text-sm">
          <span className="font-medium">Material:</span>{" "}
          <span className="text-muted-foreground">{product.material}</span>
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
            onClick={() => setQuantity(quantity + 1)}
            className="p-2 hover:bg-muted transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleAddToCart} className="flex-1 py-6 text-xs tracking-wider uppercase">
          <ShoppingBag className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
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
      </div>

      {/* Care instructions */}
      {product.careInstructions && (
        <div className="pt-6 border-t">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Care:</span>{" "}
            {product.careInstructions}
          </p>
        </div>
      )}
    </div>
  );
}
