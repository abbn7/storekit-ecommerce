"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useUIStore } from "@/stores/uiStore";
import { useStoreConfig } from "@/hooks/useStoreConfig";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { slideRightVariants, overlayVariants } from "@/lib/motion";

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, removeItem, updateQuantity, getSubtotal, getItemCount } = useCartStore();
  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const { config } = useStoreConfig();
  const freeShippingThreshold = config?.freeShippingThreshold ?? 20000;

  const freeShippingRemaining = freeShippingThreshold - subtotal;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 overlay-scrim"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <motion.div
        variants={slideRightVariants}
        initial="hidden"
        animate={isCartOpen ? "visible" : "hidden"}
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-96 max-w-[90vw] flex flex-col glass-panel-strong"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-heading text-lg tracking-wide">
            Cart ({itemCount})
          </h2>
          <button onClick={closeCart} aria-label="Close cart" className="focus-ring rounded-full p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free shipping bar */}
        {freeShippingRemaining > 0 && (
          <div className="px-4 py-3 bg-muted/50">
            <p className="text-xs text-center text-muted-foreground">
              Add <span className="font-medium text-foreground">{formatPrice(freeShippingRemaining)}</span> more for free shipping
            </p>
            <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full accent-gradient rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-heading mb-2">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mb-6">
                Discover our collections and find something you love.
              </p>
              <Button variant="outline" onClick={closeCart} asChild>
                <Link href="/collections">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={`${item.product_id}-${item.variant_id}`}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-4"
                  >
                    <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-muted rounded-lg">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.product_name}</h4>
                      {item.variant_name && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.variant_name}</p>
                      )}
                      <p className="text-sm mt-1">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => {
                            if (item.quantity < item.max_stock) {
                              updateQuantity(item.product_id, item.variant_id, item.quantity + 1);
                            }
                          }}
                          disabled={item.quantity >= item.max_stock}
                          className="p-1 hover:bg-muted rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.product_id, item.variant_id)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                        aria-label="Remove item"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-sm font-medium">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
            <Button className="w-full accent-gradient text-white hover:opacity-90 transition-opacity" asChild>
              <Link href="/checkout" onClick={closeCart}>
                Checkout
              </Link>
            </Button>
            <button
              onClick={closeCart}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}
