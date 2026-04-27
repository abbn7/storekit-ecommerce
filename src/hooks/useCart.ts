"use client";

import { useCartStore } from "@/stores/cartStore";
import type { CartItem } from "@/types";

export function useCart() {
  const store = useCartStore();

  const addItem = (item: CartItem) => {
    store.addItem(item);
  };

  const removeItem = (productId: string, variantId: string | null) => {
    store.removeItem(productId, variantId);
  };

  const updateQuantity = (productId: string, variantId: string | null, quantity: number) => {
    store.updateQuantity(productId, variantId, quantity);
  };

  const clearCart = () => {
    store.clearCart();
  };

  return {
    items: store.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal: store.getSubtotal(),
    itemCount: store.getItemCount(),
  };
}
