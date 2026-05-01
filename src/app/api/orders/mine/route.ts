import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrdersByUserId } from "@/lib/db/queries/orders";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { apiResponse, apiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

// I3 FIX: Public endpoint for authenticated users to fetch their own orders
// NEW-M6: Fixed N+1 query — batch-fetch all items for all orders at once
export async function GET(_request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return apiError("Unauthorized — please sign in", 401);
    }

    const userOrders = await getOrdersByUserId(userId);

    if (userOrders.length === 0) {
      return apiResponse([]);
    }

    // Batch-fetch all items for all orders in a single query (instead of N+1)
    const orderIds = userOrders.map((o) => o.id);
    const allItems = orderIds.length > 0
      ? await db
          .select()
          .from(orderItems)
          .where(inArray(orderItems.orderId, orderIds))
      : [];

    // Group items by orderId
    const itemsByOrderId = new Map<string, typeof allItems>();
    for (const item of allItems) {
      const existing = itemsByOrderId.get(item.orderId) ?? [];
      existing.push(item);
      itemsByOrderId.set(item.orderId, existing);
    }

    const ordersWithItems = userOrders.map((order) => ({
      ...order,
      items: itemsByOrderId.get(order.id) ?? [],
    }));

    return apiResponse(ordersWithItems);
  } catch (error) {
    logger.error("Error fetching user orders:", error);
    return apiError("Failed to fetch orders", 500);
  }
}
