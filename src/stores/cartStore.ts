import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, DiscountType } from "@/types";

interface AppliedDiscount {
  code: string;
  type: DiscountType;
  value: number;
  discountAmount: number; // in cents
}

interface CartState {
  items: CartItem[];
  discount: AppliedDiscount | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  applyDiscount: (discount: AppliedDiscount) => void;
  removeDiscount: () => void;
  getDiscountAmount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discount: null,

      addItem: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (i) => i.product_id === item.product_id && i.variant_id === item.variant_id
        );

        if (existingIndex > -1) {
          const updated = [...items];
          // H3 FIX: Cap quantity at max_stock when adding to existing item
          const newQuantity = updated[existingIndex].quantity + item.quantity;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: Math.min(newQuantity, item.max_stock),
          };
          set({ items: updated });
        } else {
          // H3 FIX: Cap initial quantity at max_stock too
          set({ items: [...items, { ...item, quantity: Math.min(item.quantity, item.max_stock) }] });
        }
      },

      removeItem: (productId, variantId) => {
        set({
          items: get().items.filter(
            (i) => !(i.product_id === productId && i.variant_id === variantId)
          ),
        });
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product_id === productId && i.variant_id === variantId
              ? { ...i, quantity: Math.min(quantity, i.max_stock) }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [], discount: null }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      applyDiscount: (discount) => {
        set({ discount });
      },

      removeDiscount: () => {
        set({ discount: null });
      },

      getDiscountAmount: () => {
        const { discount, getSubtotal } = get();
        if (!discount) return 0;

        // Recalculate discount amount based on current subtotal
        const subtotal = getSubtotal();
        switch (discount.type) {
          case "percentage":
            return Math.round(subtotal * (discount.value / 100));
          case "fixed":
            return Math.min(discount.value, subtotal);
          case "free_shipping":
            return 0; // Applied at checkout when shipping cost is known
          default:
            return 0;
        }
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discountAmount = get().getDiscountAmount();
        return Math.max(0, subtotal - discountAmount);
      },
    }),
    {
      name: "storekit-cart",
    }
  )
);
