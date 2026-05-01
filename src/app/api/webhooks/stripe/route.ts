import { NextRequest } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { getStoreConfig } from "@/lib/db/queries/store";
import { sendEmail, generateOrderConfirmationHtml } from "@/lib/email";
import { apiError } from "@/lib/api-response";
import { db } from "@/lib/db";
import { processedWebhookEvents, orders, orderItems, productVariants, products } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { logger } from "@/lib/logger";

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
            logger.error("Failed to send confirmation email:", emailError);
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        logger.error("Payment failed:", paymentIntent.id);

        // NEW-H2 FIX: Now works because we set orderId on the PaymentIntent after checkout session creation
        if (paymentIntent.metadata?.orderId) {
          const orderId = paymentIntent.metadata.orderId;
          // Restore stock inside a transaction with idempotency
          await db.transaction(async (tx) => {
            // Idempotency check
            const [inserted] = await tx
              .insert(processedWebhookEvents)
              .values({ eventId: event.id })
              .onConflictDoNothing()
              .returning({ eventId: processedWebhookEvents.eventId });

            if (!inserted) return; // Already processed

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
              } else if (item.productId) {
                // NEW-M7: Restore product stock for products without variants
                await tx
                  .update(products)
                  .set({ stock: sql`${products.stock} + ${item.quantity}` })
                  .where(eq(products.id, item.productId));
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
        logger.info("Checkout session expired:", session.id);

        // NEW-M2 FIX: Restore stock when user abandons checkout (with idempotency)
        await db.transaction(async (tx) => {
          // Idempotency check — prevent double stock restore
          const [inserted] = await tx
            .insert(processedWebhookEvents)
            .values({ eventId: event.id })
            .onConflictDoNothing()
            .returning({ eventId: processedWebhookEvents.eventId });

          if (!inserted) return; // Already processed

          const [order] = await tx
            .select()
            .from(orders)
            .where(eq(orders.stripeSessionId, session.id))
            .limit(1);

          if (order && order.status === "pending") {
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
              } else if (item.productId) {
                // NEW-M7: Restore product stock for products without variants
                await tx
                  .update(products)
                  .set({ stock: sql`${products.stock} + ${item.quantity}` })
                  .where(eq(products.id, item.productId));
              }
            }

            await tx
              .update(orders)
              .set({ status: "cancelled", updatedAt: new Date() })
              .where(eq(orders.id, order.id));
          }
        });
        break;
      }

      default:
        logger.debug(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error("Webhook handler failed:", error);
    return apiError("Webhook handler failed", 500);
  }
}
