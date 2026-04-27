import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

export async function getSalesData(days: number = 30) {
  // FIX: Use parameterized binding instead of sql.raw()
  // Drizzle auto-parameterizes template expressions
  const daysParam = Math.max(1, Math.min(365, Math.floor(days))); // Clamp to safe range
  const result = await db.execute(sql`
    SELECT 
      DATE(created_at) as date,
      COALESCE(SUM(total), 0) as revenue,
      COUNT(*) as orders
    FROM orders
    WHERE created_at >= NOW() - INTERVAL ${sql`${daysParam} days`}
    AND status != 'cancelled'
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `);
  return result as unknown as { date: string; revenue: number; orders: number }[];
}

export async function getTopProducts(limit: number = 10) {
  const safeLimit = Math.max(1, Math.min(100, Math.floor(limit)));
  const result = await db.execute(sql`
    SELECT 
      oi.product_id,
      oi.product_name,
      SUM(oi.quantity) as total_sold,
      SUM(oi.total) as revenue
    FROM order_items oi
    INNER JOIN orders o ON o.id = oi.order_id
    WHERE o.status != 'cancelled'
    GROUP BY oi.product_id, oi.product_name
    ORDER BY total_sold DESC
    LIMIT ${safeLimit}
  `);
  return result as unknown as { product_id: string; product_name: string; total_sold: number; revenue: number }[];
}

export async function getOrderStats() {
  const result = await db.execute(sql`
    SELECT 
      COUNT(*) as total_orders,
      COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) as pending_orders,
      COALESCE(SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END), 0) as processing_orders,
      COALESCE(SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END), 0) as shipped_orders,
      COALESCE(SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END), 0) as delivered_orders,
      COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total ELSE 0 END), 0) as total_revenue
    FROM orders
  `);
  const rows = result as unknown as Record<string, number>[];
  return rows[0] as {
    total_orders: number;
    pending_orders: number;
    processing_orders: number;
    shipped_orders: number;
    delivered_orders: number;
    total_revenue: number;
  };
}

export async function getProductsCount() {
  const result = await db.execute(sql`
    SELECT COUNT(*) as count FROM products WHERE is_active = true
  `);
  const rows = result as unknown as Record<string, number>[];
  return Number(rows[0]?.count ?? 0);
}
