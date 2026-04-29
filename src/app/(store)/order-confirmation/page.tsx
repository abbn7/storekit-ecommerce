import Link from "next/link";
import { CheckCircle, Package, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderByStripeSession } from "@/lib/db/queries/orders";
import { formatPrice, getCountryName } from "@/lib/utils"; // H7 FIX: Import getCountryName
import { getStoreConfig } from "@/lib/db/queries/store";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let order: Awaited<ReturnType<typeof getOrderByStripeSession>> = null;
  let currency = "USD";

  if (session_id) {
    order = await getOrderByStripeSession(session_id);
  }

  if (order) {
    const config = await getStoreConfig();
    currency = config?.currency ?? "USD";
  }

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-4">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="font-heading text-4xl font-light tracking-wide mb-4">
            Thank You!
          </h1>
          <p className="text-muted-foreground mb-2">
            Your order has been placed successfully.
          </p>
          {order ? (
            <p className="text-sm text-muted-foreground">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mb-8">
              You will receive a confirmation email shortly with your order details.
            </p>
          )}
        </div>

        {order && (
          <div className="space-y-6">
            {/* Order Items */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold text-lg">Order Items</h2>
              </div>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      {item.variantName && (
                        <p className="text-sm text-muted-foreground">{item.variantName}</p>
                      )}
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatPrice(item.total, currency)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost, currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(order.tax, currency)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(order.total, currency)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold text-lg">Shipping Address</h2>
              </div>
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.firstName} {order.lastName}</p>
                <p>{order.addressLine1}</p>
                {order.addressLine2 && <p>{order.addressLine2}</p>}
                <p>{order.city}, {order.state} {order.postalCode}</p>
                {/* H7 FIX: Display country name instead of code */}
                <p>{getCountryName(order.country)}</p>
              </div>
            </div>

            {/* Contact */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold text-lg">Contact</h2>
              </div>
              <p className="text-sm">{order.email}</p>
              {order.phone && <p className="text-sm text-muted-foreground">{order.phone}</p>}
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center mt-8">
          <Button asChild>
            <Link href="/collections">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/account/orders">View Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
