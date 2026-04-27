import { NextRequest } from "next/server";
import { createOrder, createOrderItem } from "@/lib/db/queries/orders";
import { getProductById } from "@/lib/db/queries/products";
import { getStoreConfig } from "@/lib/db/queries/store";
import { createCheckoutSession, calculateOrderAmount } from "@/lib/stripe";
import { apiResponse, apiError } from "@/lib/api-response";
import { z } from "zod";

// Zod schema for order creation (Fix #6)
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
  clerkUserId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const message = Object.entries(errors)
        .map(([key, vals]) => `${key}: ${vals?.join(", ")}`)
        .join("; ");
      return apiError(`Validation error: ${message}`, 400);
    }

    const { items, email, firstName, lastName, phone, address, clerkUserId } = parsed.data;

    // CRITICAL FIX: Fetch product prices from DB — never trust client-submitted prices
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
        if (variant.stock < item.quantity) {
          return apiError(`Insufficient stock for variant: ${variant.name}`, 400);
        }
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

    const { subtotal, shipping, tax, total } = calculateOrderAmount(
      dbItems.map((item) => ({ price: item.price, quantity: item.quantity })),
      config?.shippingCost ?? 0,
      taxRate
    );

    // Check free shipping threshold
    const finalShipping = config?.freeShippingThreshold && subtotal >= config.freeShippingThreshold
      ? 0
      : shipping;
    const finalTotal = subtotal + finalShipping + tax;

    // Create order in DB
    const order = await createOrder({
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
      clerkUserId: clerkUserId || null,
    });

    // Create order items with server-verified prices
    for (const item of dbItems) {
      await createOrderItem({
        orderId: order.id,
        productId: item.productId,
        variantId: item.variantId || null,
        productName: item.name,
        variantName: item.variantName || null,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      });
    }

    // Create Stripe checkout session with server-verified prices
    const session = await createCheckoutSession({
      items: dbItems.map((item) => ({
        name: item.name,
        description: item.variantName || undefined,
        images: item.images.slice(0, 1),
        price: item.price, // Server-verified price
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
    });

    return apiResponse({ orderId: order.id, checkoutUrl: session.url }, undefined, 201);
  } catch (error) {
    console.error("Error creating order:", error);
    return apiError("Failed to create order", 500);
  }
}
