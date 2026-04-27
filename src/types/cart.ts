import { ProductVariant } from "./product";

export interface CartItem {
  product_id: string;
  product_name: string;
  product_slug: string;
  variant_id: string | null;
  variant_name: string | null;
  price: number;
  compare_at_price: number | null;
  quantity: number;
  image_url: string;
  max_stock: number;
}

export interface CartWithTotals {
  items: CartItem[];
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  item_count: number;
  free_shipping_remaining: number | null;
}
