import { NextRequest } from "next/server";
import { deleteOrder, restoreStock } from "@/lib/db/queries/orders";
import { getProductById } from "@/lib/db/queries/products";
import { getStoreConfig } from "@/lib/db/queries/store";
import { validateDiscountCode, incrementDiscountUsage, getDiscountCodeByCode } from "@/lib/db/queries/discounts";
import { createCheckoutSession, calculateOrderAmount, stripe } from "@/lib/stripe";
import { apiResponse, apiError } from "@/lib/api-response";
import { db } from "@/lib/db";
import { orders, orderItems, productVariants, products } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { formatZodError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/logger";

// Zod schema for order creation
const orderItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  quantity: z.number().int().min(1).max(99),
  // NOTE: price is NOT accepted from client — fetched from DB server-side
});

const addressSchema = z.object({
  addressLine1: z.string().min(1).max(255),
  addressLine2: z.string().max(255).optional(),
  city: z.string().min(1).max(255),
  state: z.string().min(1).max(255),
  postalCode: z.string().min(1).max(20),
  country: z.string().min(1).max(255),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  email: z.string().email(),
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  phone: z.string().max(50).optional(),
  address: addressSchema,
  discountCode: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(`Validation error: ${formatZodError(parsed.error)}`, 400);
    }

    const { items, email, firstName, lastName, phone, address, discountCode } = parsed.data;
    const { userId } = await auth();

    // CRITICAL FIX: Fetch product prices from DB — never trust client-submitted prices
    // Stock check is moved inside the transaction for atomicity
    const dbItems: {
      productId: string;
      variantId?: string;
      name: string;
      variantName: string | null;
      price: number;
      quantity: number;
      images: string[];
    }[] = [];

    for (const item of items) {
      const product = await getProductById(item.productId);
      if (!product) {
        return apiError(`Product not found: ${item.productId}`, 400);
      }
      if (!product.isActive) {
        return apiError(`Product is not available: ${product.name}`, 400);
      }

      // Determine price: use variant price if variant specified, otherwise product price
      let price = product.price;
      let variantName: string | null = null;

      if (item.variantId) {
        const variant = product.variants?.find((v) => v.id === item.variantId);
        if (!variant) {
          return apiError(`Variant not found: ${item.variantId}`, 400);
        }
        if (!variant.isActive) {
          return apiError(`Variant is not available: ${variant.name}`, 400);
        }
        // Stock is checked atomically inside the transaction, not here
        price = variant.price;
        variantName = variant.name;
      }

      dbItems.push({
        productId: item.productId,
        variantId: item.variantId,
        name: product.name,
        variantName,
        price, // Server-side price — cannot be manipulated
        quantity: item.quantity,
        images: product.images?.map((img) => img.url) ?? [],
      });
    }

    const config = await getStoreConfig();
    const taxRate = config ? parseFloat(config.taxRate) : 0;

    const { subtotal, shipping, tax } = calculateOrderAmount(
      dbItems.map((item) => ({ price: item.price, quantity: item.quantity })),
      config?.shippingCost ?? 0,
      taxRate
    );

    // Check free shipping threshold
    let finalShipping = config?.freeShippingThreshold && subtotal >= config.freeShippingThreshold
      ? 0
      : shipping;

    // Validate and apply discount code server-side
    let discountAmount = 0;
    let discountId: string | null = null;
    if (discountCode) {
      const validation = await validateDiscountCode(discountCode, subtotal);
      if (!validation.valid) {
        return apiError(validation.error || "Invalid discount code", 400);
      }
      if (validation.discount) {
        discountAmount = validation.discount.discount_amount;
        // For free_shipping type, waive the shipping cost
        if (validation.discount.type === "free_shipping") {
          finalShipping = 0;
        }
        // Look up the discount code ID for usage tracking
        const discountRecord = await getDiscountCodeByCode(discountCode);
        if (discountRecord) {
          discountId = discountRecord.id;
        }
      }
    }

    const finalTotal = Math.max(0, subtotal - discountAmount) + finalShipping + tax;

    // CRITICAL FIX: Create order and reserve stock atomically in a transaction
    // This prevents race conditions where two orders check stock simultaneously
    const order = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(orders)
        .values({
          email,
          firstName,
          lastName,
          phone: phone || null,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2 || null,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
          status: "pending",
          subtotal,
          shippingCost: finalShipping,
          tax,
          total: finalTotal,
          stripeSessionId: null,
          clerkUserId: userId || null,
        })
        .returning();

      // Create order items with server-verified prices
      for (const item of dbItems) {
        await tx.insert(orderItems).values({
          orderId: created.id,
          productId: item.productId,
          variantId: item.variantId || null,
          productName: item.name,
          variantName: item.variantName || null,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        });
      }

      // CRITICAL FIX: Atomically decrement stock to prevent race conditions
      // Uses UPDATE with WHERE clause — if stock is insufficient, update returns 0 rows
      for (const item of dbItems) {
        if (item.variantId) {
          // NEW-M7: Decrement variant stock
          const [updated] = await tx
            .update(productVariants)
            .set({ stock: sql`${productVariants.stock} - ${item.quantity}` })
            .where(
              sql`${productVariants.id} = ${item.variantId} AND ${productVariants.stock} >= ${item.quantity}`
            )
            .returning({ stock: productVariants.stock });

          if (!updated) {
            throw new Error(`Insufficient stock for variant: ${item.variantId}`);
          }
        } else {
          // NEW-M7: Decrement product stock for products without variants
          const [updated] = await tx
            .update(products)
            .set({ stock: sql`${products.stock} - ${item.quantity}` })
            .where(
              sql`${products.id} = ${item.productId} AND ${products.stock} >= ${item.quantity}`
            )
            .returning({ stock: products.stock });

          if (!updated) {
            throw new Error(`Insufficient stock for product: ${item.productId}`);
          }
        }
      }

      return created;
    });

    // H5 FIX: Handle Stripe session creation failure — clean up orphaned order
    let session;
    try {
      session = await createCheckoutSession({
        items: dbItems.map((item) => ({
          name: item.name,
          description: item.variantName || undefined,
          images: item.images.slice(0, 1),
          price: item.price,
          quantity: item.quantity,
          productId: item.productId,
          variantId: item.variantId,
        })),
        email,
        orderId: order.id,
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
        shippingCost: finalShipping,
        taxRate,
        currency: config?.currency ?? "USD",
      });
    } catch (stripeError) {
      // CRITICAL FIX: Stripe session creation failed — restore stock before deleting order
      logger.error("Stripe session creation failed, restoring stock and cleaning up order:", stripeError);
      await restoreStock(order.id);
      await deleteOrder(order.id);
      return apiError("Failed to create payment session. Please try again.", 500);
    }

    // Save the Stripe session ID so the webhook can match the order
    await db
      .update(orders)
      .set({ stripeSessionId: session.id })
      .where(eq(orders.id, order.id));

    // NEW-H2: Update the PaymentIntent metadata with orderId so the
    // payment_intent.payment_failed webhook can find the order
    if (session.payment_intent && typeof session.payment_intent === "string") {
      try {
        await stripe.paymentIntents.update(session.payment_intent, {
          metadata: { orderId: order.id },
        });
      } catch (metadataError) {
        // Non-critical: log but don't fail the order
        logger.error("Failed to update PaymentIntent metadata:", metadataError);
      }
    }

    // Increment discount code usage after successful order
    if (discountId) {
      await incrementDiscountUsage(discountId).catch((err) =>
        logger.error("Failed to increment discount usage:", err)
      );
    }

    return apiResponse({ orderId: order.id, checkoutUrl: session.url }, undefined, 201);
  } catch (error) {
    logger.error("Error creating order:", error);
    return apiError("Failed to create order", 500);
  }
}
