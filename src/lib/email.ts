import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// HTML entity encoder to prevent XSS in email templates
function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    "&": "\u0026amp;",
    "<": "\u0026lt;",
    ">": "\u0026gt;",
    '"': "\u0026quot;",
    "'": "\u0026#039;",
  };
  return str.replace(/[&<>"']/g, (char) => map[char]);
}

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

export function generateOrderConfirmationHtml(params: {
  orderNumber: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  storeName: string;
}): string {
  // Escape all user-controlled values to prevent XSS
  const safeStoreName = escapeHtml(params.storeName);
  const safeCustomerName = escapeHtml(params.customerName);
  const safeOrderNumber = escapeHtml(params.orderNumber);

  const itemsHtml = params.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${escapeHtml(item.name)}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">$${(item.price / 100).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #fafafa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300; text-align: center; margin-bottom: 8px;">${safeStoreName}</h1>
        <p style="text-align: center; color: #666; margin-bottom: 40px;">Order Confirmation</p>

        <div style="background: white; padding: 32px; border-radius: 8px;">
          <p style="margin-top: 0;">Dear ${safeCustomerName},</p>
          <p>Thank you for your order. We're preparing your items with care.</p>

          <h2 style="font-size: 18px; margin-top: 32px;">Order #${safeOrderNumber}</h2>

          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #000;">
                <th style="padding: 12px 0; text-align: left;">Item</th>
                <th style="padding: 12px 0; text-align: center;">Qty</th>
                <th style="padding: 12px 0; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="margin-top: 24px; text-align: right;">
            <p style="margin: 4px 0; color: #666;">Subtotal: $${(params.subtotal / 100).toFixed(2)}</p>
            <p style="margin: 4px 0; color: #666;">Shipping: $${(params.shipping / 100).toFixed(2)}</p>
            <p style="margin: 4px 0; color: #666;">Tax: $${(params.tax / 100).toFixed(2)}</p>
            <p style="margin: 12px 0; font-size: 18px; font-weight: 600;">Total: $${(params.total / 100).toFixed(2)}</p>
          </div>
        </div>

        <p style="text-align: center; color: #999; font-size: 12px; margin-top: 40px;">
          © ${new Date().getFullYear()} ${safeStoreName}. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;
}

export function generateOrderStatusUpdateHtml(params: {
  orderNumber: string;
  customerName: string;
  status: string;
  storeName: string;
}): string {
  // Escape all user-controlled values to prevent XSS
  const safeStoreName = escapeHtml(params.storeName);
  const safeCustomerName = escapeHtml(params.customerName);
  const safeOrderNumber = escapeHtml(params.orderNumber);
  const safeStatus = escapeHtml(params.status);

  const statusMessages: Record<string, string> = {
    processing: "Your order is being prepared with care.",
    shipped: "Your order is on its way to you.",
    delivered: "Your order has been delivered. Enjoy!",
    cancelled: "Your order has been cancelled.",
    refunded: "A refund has been issued for your order.",
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #fafafa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300; text-align: center; margin-bottom: 8px;">${safeStoreName}</h1>

        <div style="background: white; padding: 32px; border-radius: 8px; text-align: center;">
          <h2 style="font-size: 24px; font-weight: 300; margin-top: 0;">Order Update</h2>
          <p>Dear ${safeCustomerName},</p>
          <p style="font-size: 18px; margin: 24px 0;">Order #${safeOrderNumber}</p>
          <p style="font-size: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">${safeStatus}</p>
          <p style="color: #666;">${statusMessages[params.status] ?? "Your order status has been updated."}</p>
        </div>

        <p style="text-align: center; color: #999; font-size: 12px; margin-top: 40px;">
          © ${new Date().getFullYear()} ${safeStoreName}. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;
}
