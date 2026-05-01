"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Lock, Truck, RotateCcw, Shield, Tag, Calendar } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useStoreConfig } from "@/hooks/useStoreConfig";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FadeIn } from "@/lib/motion";
import { motion, AnimatePresence } from "framer-motion";
import { calculateEstimatedDelivery } from "@/lib/delivery";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getItemCount, discount, applyDiscount, removeDiscount, getDiscountAmount } = useCartStore();
  const { config } = useStoreConfig();
  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const discountAmount = getDiscountAmount();
  const freeShippingThreshold = config?.freeShippingThreshold ?? 20000;
  const freeShippingRemaining = freeShippingThreshold - subtotal;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : (config?.shippingCost ?? 0);
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const delivery = calculateEstimatedDelivery();

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12">
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 block">
              Your Bag
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-light tracking-wide">
              Shopping Cart ({itemCount})
            </h1>
          </div>
        </FadeIn>

        {items.length === 0 ? (
          <FadeIn>
            <div className="text-center py-20 glass-panel-strong rounded-2xl max-w-lg mx-auto">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <p className="font-heading text-2xl mb-4">Your cart is empty</p>
              <p className="text-muted-foreground mb-8">
                Discover our collections and find something you love.
              </p>
              <Button asChild className="accent-gradient text-white hover:opacity-90 transition-opacity">
                <Link href="/collections">
                  Continue Shopping
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items - Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Free shipping progress bar */}
              {freeShippingRemaining > 0 && (
                <FadeIn>
                  <div className="glass-panel rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Truck className="h-4 w-4 text-accent" />
                      <p className="text-sm">
                        Add <span className="font-medium text-foreground">{formatPrice(freeShippingRemaining)}</span> more for free shipping
                      </p>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full accent-gradient rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
                      />
                    </div>
                  </div>
                </FadeIn>
              )}

              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={`${item.product_id}-${item.variant_id}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-6 py-6 border-b glass-panel-strong rounded-xl p-5"
                  >
                    <div className="relative h-32 w-24 flex-shrink-0 bg-muted overflow-hidden rounded-lg">
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
                        <button
                          onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)}
                          className="p-1.5 border rounded-md hover:bg-muted transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => {
                            if (item.quantity < item.max_stock) {
                              updateQuantity(item.product_id, item.variant_id, item.quantity + 1);
                            }
                          }}
                          disabled={item.quantity >= item.max_stock}
                          className="p-1.5 border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.product_id, item.variant_id)}
                        className="p-1.5 hover:bg-muted rounded-md transition-colors"
                        aria-label="Remove"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Continue shopping link */}
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary - Right Column (Sticky) */}
            <div className="lg:col-span-1">
              <FadeIn delay={0.1}>
                <div className="glass-panel-strong rounded-2xl p-6 lg:sticky lg:top-28 space-y-6">
                  <h2 className="font-heading text-2xl tracking-wide">Order Summary</h2>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {discount && discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-emerald-600">
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          Discount ({discount.code})
                        </span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-muted-foreground">Calculated at checkout</span>
                    </div>
                  </div>

                  {/* Discount Code Input */}
                  {!discount ? (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!discountCode.trim()) return;
                        setDiscountLoading(true);
                        setDiscountError(null);
                        try {
                          const res = await fetch("/api/discounts/validate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ code: discountCode, subtotal }),
                          });
                          const data = await res.json();
                          if (data.data?.valid && data.data?.discount) {
                            applyDiscount(data.data.discount);
                            setDiscountCode("");
                          } else {
                            setDiscountError(data.data?.error || "Invalid discount code");
                          }
                        } catch {
                          setDiscountError("Failed to validate code");
                        } finally {
                          setDiscountLoading(false);
                        }
                      }}
                      className="space-y-2"
                    >
                      <Label className="text-xs text-muted-foreground">Discount Code</Label>
                      <div className="flex gap-2">
                        <Input
                          value={discountCode}
                          onChange={(e) => { setDiscountCode(e.target.value.toUpperCase()); setDiscountError(null); }}
                          placeholder="Enter code"
                          className="h-9 text-sm uppercase"
                        />
                        <Button type="submit" variant="outline" size="sm" disabled={discountLoading || !discountCode.trim()} className="h-9 px-4">
                          Apply
                        </Button>
                      </div>
                      {discountError && <p className="text-xs text-destructive">{discountError}</p>}
                    </form>
                  ) : (
                    <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/30 rounded-lg px-3 py-2">
                      <span className="text-sm flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                        <Tag className="h-3.5 w-3.5" />
                        {discount.code} — {discount.type === "percentage" ? `${discount.value}% off` : discount.type === "fixed" ? `${(discount.value / 100).toFixed(2)} off` : "Free shipping"}
                      </span>
                      <button onClick={() => removeDiscount()} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        Remove
                      </button>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Subtotal</span>
                      <span className="text-lg font-medium">{formatPrice(discountAmount > 0 ? subtotal - discountAmount : subtotal)}</span>
                    </div>
                  </div>

                  {/* Estimated Delivery */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                    <Calendar className="h-4 w-4 text-accent flex-shrink-0" />
                    <span>Estimated delivery: <span className="text-foreground font-medium">{delivery.rangeLabel}</span></span>
                  </div>

                  <Button className="w-full py-6 accent-gradient text-white hover:opacity-90 transition-opacity text-sm tracking-wider uppercase" asChild>
                    <Link href="/checkout">
                      <Lock className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </Link>
                  </Button>

                  {/* Trust badges */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="text-center">
                      <Shield className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground block">Secure Checkout</span>
                    </div>
                    <div className="text-center">
                      <Truck className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground block">Free Shipping</span>
                    </div>
                    <div className="text-center">
                      <RotateCcw className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground block">Easy Returns</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
