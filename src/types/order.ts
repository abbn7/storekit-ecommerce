export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface Order {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  stripe_session_id: string | null;
  clerk_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

// ─── Discount Codes ───────────────────────────────────
export type DiscountType = "percentage" | "fixed" | "free_shipping";

export interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  type: DiscountType;
  value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  starts_at: string;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface DiscountValidation {
  valid: boolean;
  error?: string;
  discount?: {
    code: string;
    type: DiscountType;
    value: number;
    discount_amount: number; // computed discount in cents
  };
}
