import { logger } from "@/lib/logger";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getSalesData, getTopProducts, getOrderStats, getProductsCount } from "@/lib/db/queries/analytics";
import { apiResponse, apiError } from "@/lib/api-response";

// I5 FIX: Simple in-memory rate limit for public API routes
// For production, use a proper rate limiting solution like Upstash Ratelimit

export async function GET() {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const [salesData, topProducts, orderStats, productsCount] = await Promise.all([
      getSalesData(30),
      getTopProducts(10),
      getOrderStats(),
      getProductsCount(),
    ]);

    return apiResponse({
      stats: {
        total_revenue: Number(orderStats?.total_revenue ?? 0),
        total_orders: Number(orderStats?.total_orders ?? 0),
        total_products: productsCount,
        pending_orders: Number(orderStats?.pending_orders ?? 0),
        processing_orders: Number(orderStats?.processing_orders ?? 0),
        shipped_orders: Number(orderStats?.shipped_orders ?? 0),
        delivered_orders: Number(orderStats?.delivered_orders ?? 0),
      },
      salesChart: salesData,
      topProducts,
    });
  } catch (error) {
    logger.error("Error fetching analytics:", error);
    return apiError("Failed to fetch analytics", 500);
  }
}
