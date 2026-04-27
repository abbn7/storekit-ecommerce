import { NextRequest } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { getOrderByStripeSession, updateOrderStatus } from "@/lib/db/queries/orders";
import { getStoreConfig } from "@/lib/db/queries/store";
import { sendEmail, generateOrderConfirmationHtml, generateOrderStatusUpdateHtml } from "@/lib/email";
import { apiError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return apiError("Missing stripe-signature header", 400);
    }

    let event;
    try {
      event = constructWebhookEvent(body, signature);
    } catch {
      return apiError("Invalid signature", 400);
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const sessionId = session.id;

        // Update order with stripe session ID and mark as processing
        const order = await getOrderByStripeSession(sessionId);
        if (order) {
          await updateOrderStatus(order.id, "processing");

          // Send confirmation email
          try {
            const config = await getStoreConfig();
            const storeName = config?.name || "Store";
            await sendEmail({
              to: order.email,
              subject: `Order Confirmation - #${order.id.slice(0, 8)}`,
              html: generateOrderConfirmationHtml({
                orderNumber: order.id.slice(0, 8),
                customerName: `${order.firstName} ${order.lastName}`,
                items: order.items.map((item) => ({
                  name: item.productName + (item.variantName ? ` (${item.variantName})` : ""),
                  quantity: item.quantity,
                  price: item.price,
                })),
                subtotal: order.subtotal,
                shipping: order.shippingCost,
                tax: order.tax,
                total: order.total,
                storeName,
              }),
            });
          } catch (emailError) {
            console.error("Failed to send confirmation email:", emailError);
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.error("Payment failed:", paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return apiError("Webhook handler failed", 500);
  }
}
