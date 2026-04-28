import { Resend } from "resend";
import { render } from "@react-email/render";
import { OrderConfirmation } from "@/emails/OrderConfirmation";
import { OrderShipped } from "@/emails/OrderShipped";
import { OrderDelivered } from "@/emails/OrderDelivered";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "noreply@store.com",
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Email send error:", error);
    throw error;
  }

  return data;
}

export async function generateOrderConfirmationHtml(params: {
  orderNumber: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  storeName: string;
}): Promise<string> {
  const element = OrderConfirmation(params);
  return render(element);
}

export async function generateOrderShippedHtml(params: {
  orderNumber: string;
  customerName: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  estimatedDelivery?: string;
  items: { name: string; quantity: number; price: number }[];
  shippingAddress: string;
  storeName: string;
}): Promise<string> {
  const element = OrderShipped(params);
  return render(element);
}

export async function generateOrderDeliveredHtml(params: {
  orderNumber: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  storeName: string;
  reviewUrl?: string;
}): Promise<string> {
  const element = OrderDelivered(params);
  return render(element);
}

export async function generateOrderStatusUpdateHtml(params: {
  orderNumber: string;
  customerName: string;
  status: string;
  storeName: string;
  items?: { name: string; quantity: number; price: number }[];
  shippingAddress?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  estimatedDelivery?: string;
  reviewUrl?: string;
}): Promise<string> {
  // Map status to the appropriate dedicated template
  const { status } = params;
  const items = params.items ?? [];

  if (status === "shipped") {
    return generateOrderShippedHtml({
      orderNumber: params.orderNumber,
      customerName: params.customerName,
      items,
      shippingAddress: params.shippingAddress ?? "",
      storeName: params.storeName,
      trackingNumber: params.trackingNumber,
      trackingUrl: params.trackingUrl,
      carrier: params.carrier,
      estimatedDelivery: params.estimatedDelivery,
    });
  }

  if (status === "delivered") {
    return generateOrderDeliveredHtml({
      orderNumber: params.orderNumber,
      customerName: params.customerName,
      items,
      storeName: params.storeName,
      reviewUrl: params.reviewUrl,
    });
  }

  // Fallback for other statuses
  const statusMessages: Record<string, string> = {
    processing: "Your order is being prepared with care.",
    pending: "Your order has been received and is pending.",
    cancelled: "Your order has been cancelled.",
    refunded: "A refund has been issued for your order.",
  };

  const html = await render(
    OrderConfirmation({
      orderNumber: params.orderNumber,
      customerName: params.customerName,
      items,
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      shipping: 0,
      tax: 0,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      storeName: params.storeName,
    })
  );
  return html.replace(
    "Order Confirmation",
    `Order Update: ${statusMessages[status] ?? "Your order status has been updated."}`
  );
}
