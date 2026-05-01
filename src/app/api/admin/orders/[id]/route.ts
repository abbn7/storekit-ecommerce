import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getOrderById, updateOrderStatus } from "@/lib/db/queries/orders";
import { getStoreConfig } from "@/lib/db/queries/store";
import { sendEmail, generateOrderStatusUpdateHtml } from "@/lib/email";
import { apiResponse, apiError } from "@/lib/api-response";
import { updateOrderStatusSchema } from "@/lib/validations";
import { formatZodError } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) return apiError("Order not found", 404);
    return apiResponse(order);
  } catch (error) {
    logger.error("Error fetching order:", error);
    return apiError("Failed to fetch order", 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const { id } = await params;
    const body = await request.json();
    const parsed = updateOrderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(`Validation error: ${formatZodError(parsed.error)}`, 400);
    }
    const { status } = parsed.data;

    // H1 FIX: Check for null return (order not found)
    const order = await updateOrderStatus(id, status);
    if (!order) return apiError("Order not found", 404);

    // Send status update email for shipped/delivered/cancelled
    if (["shipped", "delivered", "cancelled", "refunded"].includes(status)) {
      try {
        const config = await getStoreConfig();
        // Fetch full order with items for the email
        const fullOrder = await getOrderById(order.id);
        const emailItems = fullOrder?.items.map((item) => ({
          name: item.productName + (item.variantName ? ` (${item.variantName})` : ""),
          quantity: item.quantity,
          price: item.price,
        })) ?? [];
        const shippingAddress = fullOrder
          ? `${fullOrder.addressLine1}${fullOrder.addressLine2 ? `, ${fullOrder.addressLine2}` : ""}, ${fullOrder.city}, ${fullOrder.state} ${fullOrder.postalCode}, ${fullOrder.country}`
          : "";

        const html = await generateOrderStatusUpdateHtml({
          orderNumber: order.id.slice(0, 8),
          customerName: `${order.firstName} ${order.lastName}`,
          status,
          storeName: config?.name || "Store",
          items: emailItems,
          shippingAddress,
        });
        await sendEmail({
          to: order.email,
          subject: `Order Update - #${order.id.slice(0, 8)}`,
          html,
        });
      } catch (emailError) {
        logger.error("Failed to send status email:", emailError);
      }
    }

    return apiResponse(order);
  } catch (error) {
    logger.error("Error updating order:", error);
    return apiError("Failed to update order", 500);
  }
}
