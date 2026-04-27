"use client";

import { useWishlistStore } from "@/stores/wishlistStore";

export function useWishlist() {
  const store = useWishlistStore();

  return {
    items: store.items,
    addItem: store.addItem,
    removeItem: store.removeItem,
    isInWishlist: store.isInWishlist,
  };
}
