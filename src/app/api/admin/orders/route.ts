import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getOrders } from "@/lib/db/queries/orders";
import { apiResponse, apiError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const status = searchParams.get("status") || undefined;

    const orders = await getOrders(page, limit, status);
    return apiResponse(orders);
  } catch (error) {
    logger.error("Error fetching orders:", error);
    return apiError("Failed to fetch orders", 500);
  }
}
