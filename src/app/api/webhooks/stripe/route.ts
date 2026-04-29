import { NextRequest } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { getStoreConfig } from "@/lib/db/queries/store";
import { sendEmail, generateOrderConfirmationHtml } from "@/lib/email";
import { apiError } from "@/lib/api-response";
import { db } from "@/lib/db";
import { processedWebhookEvents, orders, orderItems, productVariants } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

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
        const eventId = event.id;

        // C5+C6 FIX: Wrap everything in a transaction for atomicity
        // Use tx for ALL queries inside the transaction (not the global db)
        let orderProcessed = false;

        await db.transaction(async (tx) => {
          // Atomic idempotency check: INSERT with ON CONFLICT DO NOTHING
          // If the insert returns no rows, the event was already processed
          const [inserted] = await tx
            .insert(processedWebhookEvents)
            .values({ eventId })
            .onConflictDoNothing()
            .returning({ eventId: processedWebhookEvents.eventId });

          if (!inserted) {
            // Event already processed — skip
            return;
          }

          // Update order status to processing — use tx, not global db
          const [order] = await tx
            .select()
            .from(orders)
            .where(eq(orders.stripeSessionId, sessionId))
            .limit(1);

          if (order) {
            await tx
              .update(orders)
              .set({ status: "processing", updatedAt: new Date() })
              .where(eq(orders.id, order.id));

            orderProcessed = true;
          }
        });

        // Send confirmation email outside the transaction (non-critical path)
        if (orderProcessed) {
          try {
            // Fetch order with items for the email
            const [order] = await db
              .select()
              .from(orders)
              .where(eq(orders.stripeSessionId, sessionId))
              .limit(1);

            if (order) {
              const items = await db
                .select()
                .from(orderItems)
                .where(eq(orderItems.orderId, order.id));

              const config = await getStoreConfig();
              const storeName = config?.name || "Store";
              const html = await generateOrderConfirmationHtml({
                orderNumber: order.id.slice(0, 8),
                customerName: `${order.firstName} ${order.lastName}`,
                items: items.map((item) => ({
                  name: item.productName + (item.variantName ? ` (${item.variantName})` : ""),
                  quantity: item.quantity,
                  price: item.price,
                })),
                subtotal: order.subtotal,
                shipping: order.shippingCost,
                tax: order.tax,
                total: order.total,
                storeName,
              });
              await sendEmail({
                to: order.email,
                subject: `Order Confirmation - #${order.id.slice(0, 8)}`,
                html,
              });
            }
          } catch (emailError) {
            console.error("Failed to send confirmation email:", emailError);
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.error("Payment failed:", paymentIntent.id);

        // CRITICAL FIX: Restore stock and cancel order when payment fails
        if (paymentIntent.metadata?.orderId) {
          const orderId = paymentIntent.metadata.orderId;
          // Restore stock inside a transaction
          await db.transaction(async (tx) => {
            const items = await tx
              .select()
              .from(orderItems)
              .where(eq(orderItems.orderId, orderId));

            for (const item of items) {
              if (item.variantId) {
                await tx
                  .update(productVariants)
                  .set({ stock: sql`${productVariants.stock} + ${item.quantity}` })
                  .where(eq(productVariants.id, item.variantId));
              }
            }

            await tx
              .update(orders)
              .set({ status: "cancelled", updatedAt: new Date() })
              .where(eq(orders.id, orderId));
          });
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        console.log("Checkout session expired:", session.id);

        // CRITICAL FIX: Restore stock when user abandons checkout
        const [order] = await db
          .select()
          .from(orders)
          .where(eq(orders.stripeSessionId, session.id))
          .limit(1);

        if (order && order.status === "pending") {
          await db.transaction(async (tx) => {
            const items = await tx
              .select()
              .from(orderItems)
              .where(eq(orderItems.orderId, order.id));

            for (const item of items) {
              if (item.variantId) {
                await tx
                  .update(productVariants)
                  .set({ stock: sql`${productVariants.stock} + ${item.quantity}` })
                  .where(eq(productVariants.id, item.variantId));
              }
            }

            await tx
              .update(orders)
              .set({ status: "cancelled", updatedAt: new Date() })
              .where(eq(orders.id, order.id));
          });
        }
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
