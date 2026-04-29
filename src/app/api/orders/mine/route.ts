import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrdersByUserId, getOrderById } from "@/lib/db/queries/orders";
import { apiResponse, apiError } from "@/lib/api-response";

// I3 FIX: Public endpoint for authenticated users to fetch their own orders
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return apiError("Unauthorized — please sign in", 401);
    }

    const orders = await getOrdersByUserId(userId);

    // Enrich each order with its items
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const fullOrder = await getOrderById(order.id);
        return fullOrder ?? order;
      })
    );

    return apiResponse(ordersWithItems);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return apiError("Failed to fetch orders", 500);
  }
}
