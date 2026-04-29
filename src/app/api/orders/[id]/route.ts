import { NextRequest } from "next/server";
import { getOrderById, getOrderByStripeSession } from "@/lib/db/queries/orders";
import { verifyAdminSession } from "@/lib/admin-auth";
import { apiResponse, apiError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionId = request.nextUrl.searchParams.get("session_id");

    // Public access only via Stripe session_id (unguessable, tied to checkout)
    // Direct order ID lookup requires admin authentication
    if (!sessionId) {
      const isAuth = await verifyAdminSession();
      if (!isAuth) {
        return apiError("Unauthorized — provide session_id or admin credentials", 401);
      }
    }

    const order = sessionId
      ? await getOrderByStripeSession(sessionId)
      : await getOrderById(id);

    if (!order) {
      return apiError("Order not found", 404);
    }

    if (sessionId && order.id !== id) {
      return apiError("Order/session mismatch", 400);
    }

    return apiResponse(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return apiError("Failed to fetch order", 500);
  }
}
