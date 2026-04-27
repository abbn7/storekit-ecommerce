import { NextRequest } from "next/server";
import { getOrderById, getOrderByStripeSession } from "@/lib/db/queries/orders";
import { apiResponse, apiError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionId = request.nextUrl.searchParams.get("session_id");

    let order;
    if (sessionId) {
      order = await getOrderByStripeSession(sessionId);
    } else {
      order = await getOrderById(id);
    }

    if (!order) {
      return apiError("Order not found", 404);
    }
    return apiResponse(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return apiError("Failed to fetch order", 500);
  }
}
