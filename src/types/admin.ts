export interface AdminStats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  total_customers: number;
  revenue_change: number;
  orders_change: number;
}

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  product_id: string;
  product_name: string;
  total_sold: number;
  revenue: number;
}

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
}
