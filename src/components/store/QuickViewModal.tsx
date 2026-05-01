"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Heart, ShoppingBag } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useUIStore } from "@/stores/uiStore";
import { formatPrice, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface QuickViewProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: { url: string; alt_text: string | null; is_primary: boolean }[];
  description?: string;
  material?: string | null;
  isNew?: boolean;
  isFeatured?: boolean;
  stock?: number;
}

interface QuickViewModalProps {
  product: QuickViewProduct | null;
  open: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { openCart } = useUIStore();

  if (!product) return null;

  const primaryImage = product.images.find((img) => img.is_primary)?.url || product.images[0]?.url;
  const isOnSale = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const discount = isOnSale && product.compareAtPrice != null ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;
  const wishlisted = isInWishlist(product.id);
  const maxStock = product.stock ?? 10;

  const handleAddToCart = () => {
    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      variant_id: null,
      variant_name: null,
      price: product.price,
      compare_at_price: product.compareAtPrice,
      quantity,
      image_url: primaryImage || "",
      max_stock: maxStock,
    });
    openCart();
    onClose();
  };

  const handleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        price: product.price,
        image_url: primaryImage || "",
      });
    }
  };

  // Reset state when product changes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setQuantity(1);
      setSelectedImageIndex(0);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden gap-0">
        <DialogTitle className="sr-only">{product.name} — Quick View</DialogTitle>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div className="relative aspect-[3/4] md:aspect-auto bg-muted">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <Image
                  src={product.images[selectedImageIndex]?.url || primaryImage || ""}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            </AnimatePresence>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {product.isNew && (
                <Badge variant="secondary" className="text-[10px] tracking-wider uppercase bg-white/80 backdrop-blur-sm border-0">
                  New
                </Badge>
              )}
              {isOnSale && (
                <Badge className="text-[10px] tracking-wider uppercase bg-destructive text-white border-0">
                  -{discount}%
                </Badge>
              )}
            </div>

            {/* Thumbnail strip */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-10">
                {product.images.slice(0, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={cn(
                      "relative w-12 h-16 overflow-hidden rounded-md border-2 transition-all",
                      selectedImageIndex === i
                        ? "border-foreground"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" sizes="48px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="p-6 md:p-8 flex flex-col">
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="font-heading text-2xl font-light tracking-wide">
                  {product.name}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className={cn("text-lg", isOnSale && "text-destructive font-medium")}>
                    {formatPrice(product.price)}
                  </span>
                  {isOnSale && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.compareAtPrice!)}
                    </span>
                  )}
                </div>
              </div>

              {product.description && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {product.description}
                </p>
              )}

              {product.material && (
                <p className="text-sm">
                  <span className="font-medium">Material:</span>{" "}
                  <span className="text-muted-foreground">{product.material}</span>
                </p>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-muted transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-10 text-center text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                    disabled={quantity >= maxStock}
                    className="p-2 hover:bg-muted disabled:opacity-50 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                {maxStock < 10 && (
                  <span className="text-xs text-muted-foreground">Only {maxStock} left</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mt-6 pt-6 border-t">
              <Button
                onClick={handleAddToCart}
                className="w-full py-5 accent-gradient text-white hover:opacity-90 transition-opacity text-sm tracking-wider uppercase"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Bag
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={handleWishlist}
                >
                  <Heart className={cn("h-4 w-4", wishlisted && "fill-destructive text-destructive")} />
                  {wishlisted ? "Wishlisted" : "Wishlist"}
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/products/${product.slug}`}>
                    Full Details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
