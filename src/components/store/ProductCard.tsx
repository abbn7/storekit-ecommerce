"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { useUIStore } from "@/stores/uiStore";
import { formatPrice, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: { url: string; alt_text: string | null; is_primary: boolean }[];
  isNew?: boolean;
  isFeatured?: boolean;
  stock?: number;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  images,
  isNew,
  isFeatured,
  stock,
}: ProductCardProps) {
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const { openCart } = useUIStore();
  const wishlisted = isInWishlist(id);

  const primaryImage = images.find((img) => img.is_primary)?.url || images[0]?.url;
  const secondaryImage = images[1]?.url;
  const isOnSale = compareAtPrice && compareAtPrice > price;
  const discount = isOnSale ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      product_id: id,
      product_name: name,
      product_slug: slug,
      variant_id: null,
      variant_name: null,
      price,
      compare_at_price: compareAtPrice,
      quantity: 1,
      image_url: primaryImage || "",
      max_stock: stock ?? 99,
    });
    openCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        product_id: id,
        product_name: name,
        product_slug: slug,
        price,
        image_url: primaryImage || "",
      });
    }
  };

  return (
    <div className="group relative">
      <Link href={`/products/${slug}`} className="block">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {primaryImage ? (
            <>
              <Image
                src={primaryImage}
                alt={name}
                fill
                className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              {secondaryImage && (
                <Image
                  src={secondaryImage}
                  alt={name}
                  fill
                  className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No image
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNew && (
              <Badge variant="secondary" className="text-[10px] tracking-wider uppercase">
                New
              </Badge>
            )}
            {isOnSale && (
              <Badge className="text-[10px] tracking-wider uppercase bg-destructive text-white">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                wishlisted ? "fill-destructive text-destructive" : "text-foreground"
              )}
            />
          </button>

          {/* Quick Add button */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-foreground text-background py-3 text-xs font-medium tracking-wider uppercase hover:bg-foreground/90 transition-colors"
            >
              Quick Add
            </button>
          </div>
        </div>

        {/* Product info */}
        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-medium truncate">{name}</h3>
          <div className="flex items-center gap-2">
            <span className={cn("text-sm", isOnSale && "text-destructive font-medium")}>
              {formatPrice(price)}
            </span>
            {isOnSale && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
