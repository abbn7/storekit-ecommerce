import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/db/queries/orders";
import { formatPrice, getCountryName } from "@/lib/utils";
import { Breadcrumbs } from "@/components/store/Breadcrumbs";
import { Package, Truck, CheckCircle, Clock, MapPin, Mail, ArrowLeft } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Order Details",
  description: "View your order details and tracking information",
};

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: MapPin },
];

function getStatusIndex(status: string): number {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const currentStatusIndex = getStatusIndex(order.status);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Account", href: "/account" },
            { label: "Orders", href: "/account/orders" },
            { label: `Order #${order.id.slice(0, 8)}` },
          ]}
        />

        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl font-light tracking-wide">
                Order #{order.id.slice(0, 8)}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              All Orders
            </Link>
          </div>
        </FadeIn>

        {/* Order Status Timeline */}
        <FadeIn delay={0.1}>
          <div className="glass-panel rounded-2xl p-6 mb-8">
            <h2 className="font-heading text-lg tracking-wide mb-6">Order Status</h2>
            <div className="flex items-center justify-between relative">
              {/* Progress bar background */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted">
                <div
                  className="h-full accent-gradient transition-all duration-500"
                  style={{ width: `${(currentStatusIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                />
              </div>

              {STATUS_STEPS.map((step, i) => {
                const Icon = step.icon;
                const isCompleted = i <= currentStatusIndex;
                const isCurrent = i === currentStatusIndex;

                return (
                  <div key={step.key} className="relative flex flex-col items-center z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "accent-gradient text-white"
                          : "bg-muted text-muted-foreground"
                      } ${isCurrent ? "ring-4 ring-accent/20" : ""}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className={`text-[10px] mt-2 tracking-wider uppercase ${
                      isCompleted ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Items */}
          <FadeIn delay={0.15}>
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="font-heading text-lg tracking-wide mb-4">Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-3 border-b border-border/50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.productName}</p>
                      {item.variantName && (
                        <p className="text-xs text-muted-foreground">{item.variantName}</p>
                      )}
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.total)}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Order Summary & Shipping */}
          <div className="space-y-8">
            <FadeIn delay={0.2}>
              <div className="glass-panel rounded-2xl p-6">
                <h2 className="font-heading text-lg tracking-wide mb-4">Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-medium">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div className="glass-panel rounded-2xl p-6">
                <h2 className="font-heading text-lg tracking-wide mb-4">Shipping Address</h2>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="text-foreground font-medium">{order.firstName} {order.lastName}</p>
                  <p>{order.addressLine1}</p>
                  {order.addressLine2 && <p>{order.addressLine2}</p>}
                  <p>{order.city}, {order.state} {order.postalCode}</p>
                  <p>{getCountryName(order.country)}</p>
                  {order.phone && (
                    <div className="flex items-center gap-2 pt-2">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{order.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{order.email}</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}

function Phone({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
