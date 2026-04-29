import Stripe from "stripe";
import { env } from "@/lib/config";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  typescript: true,
});

interface CheckoutLineItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      description?: string;
      images?: string[];
      metadata?: Record<string, string>;
    };
    unit_amount: number;
  };
  quantity: number;
  tax_rates?: string[];
}

export async function createCheckoutSession(params: {
  items: {
    name: string;
    description?: string;
    images?: string[];
    price: number;
    quantity: number;
    productId: string;
    variantId?: string;
  }[];
  email: string;
  orderId: string;
  successUrl: string;
  cancelUrl: string;
  shippingCost: number;
  taxRate: number;
  currency: string;
  taxRateId?: string;
}) {
  const currency = params.currency.toLowerCase();

  // If a Stripe tax_rate ID is configured, apply it to line items
  // Otherwise, fall back to adding tax as a line item
  const useStripeTaxRate = !!params.taxRateId;

  const lineItems: CheckoutLineItem[] = params.items.map((item) => ({
    price_data: {
      currency,
      product_data: {
        name: item.name,
        description: item.description,
        images: item.images,
        metadata: {
          productId: item.productId,
          variantId: item.variantId ?? "",
        },
      },
      unit_amount: item.price,
    },
    quantity: item.quantity,
    ...(useStripeTaxRate ? { tax_rates: [params.taxRateId!] } : {}),
  }));

  // Add shipping as a line item if > 0
  if (params.shippingCost > 0) {
    lineItems.push({
      price_data: {
        currency,
        product_data: {
          name: "Shipping",
          description: "Standard shipping",
        },
        unit_amount: params.shippingCost,
      },
      quantity: 1,
      ...(useStripeTaxRate ? { tax_rates: [params.taxRateId!] } : {}),
    });
  }

  // Fallback: Add tax as a line item only if no Stripe tax_rate is configured
  if (!useStripeTaxRate && params.taxRate > 0) {
    const subtotal = params.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxAmount = Math.round(subtotal * params.taxRate);
    if (taxAmount > 0) {
      lineItems.push({
        price_data: {
          currency,
          product_data: {
            name: "Tax",
            description: "Sales tax",
          },
          unit_amount: taxAmount,
        },
        quantity: 1,
      });
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    customer_email: params.email,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      orderId: params.orderId,
    },
  });

  return session;
}

export function constructWebhookEvent(payload: string | Buffer, signature: string) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    env.STRIPE_WEBHOOK_SECRET
  );
}

export function calculateOrderAmount(
  items: { price: number; quantity: number }[],
  shippingCost: number = 0,
  taxRate: number = 0
): { subtotal: number; shipping: number; tax: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + shippingCost + tax;
  return { subtotal, shipping: shippingCost, tax, total };
}
