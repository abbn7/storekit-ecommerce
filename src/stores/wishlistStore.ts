import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  product_id: string;
  product_name: string;
  product_slug: string;
  price: number;
  image_url: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        if (items.some((i) => i.product_id === item.product_id)) return;
        set({ items: [...items, item] });
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.product_id !== productId) });
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.product_id === productId);
      },
    }),
    {
      name: "storekit-wishlist",
    }
  )
);
