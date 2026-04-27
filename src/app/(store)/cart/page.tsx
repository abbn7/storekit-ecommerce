"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getItemCount } = useCartStore();
  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-light tracking-wide text-center mb-12">
          Shopping Cart ({itemCount})
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <p className="font-heading text-2xl mb-4">Your cart is empty</p>
            <p className="text-muted-foreground mb-8">
              Discover our collections and find something you love.
            </p>
            <Button asChild>
              <Link href="/collections">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div key={`${item.product_id}-${item.variant_id}`} className="flex gap-6 py-6 border-b">
                <div className="relative h-32 w-24 flex-shrink-0 bg-muted overflow-hidden">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.product_name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-muted-foreground">No image</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product_slug}`} className="font-medium hover:text-accent transition-colors">
                    {item.product_name}
                  </Link>
                  {item.variant_name && <p className="text-sm text-muted-foreground mt-1">{item.variant_name}</p>}
                  <p className="text-sm mt-2">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)} className="p-1 border hover:bg-muted"><Minus className="h-3 w-3" /></button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)} className="p-1 border hover:bg-muted"><Plus className="h-3 w-3" /></button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.product_id, item.variant_id)} className="p-1 hover:bg-muted" aria-label="Remove"><X className="h-4 w-4" /></button>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-6">
              <span className="text-lg">Subtotal</span>
              <span className="text-lg font-medium">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-sm text-muted-foreground">Shipping and taxes calculated at checkout.</p>
            <Button className="w-full py-6" asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
