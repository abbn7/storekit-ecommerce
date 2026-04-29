"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, getCountryName } from "@/lib/utils";
import { FadeIn } from "@/lib/motion";
import { scaleFadeVariants, ease, duration } from "@/lib/motion";

interface OrderItem {
  id: string;
  productName: string;
  variantName: string | null;
  quantity: number;
  total: number;
}

interface OrderData {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  email: string;
  phone: string | null;
}

interface OrderConfirmationContentProps {
  order: OrderData | null;
  currency: string;
}

export function OrderConfirmationContent({ order, currency }: OrderConfirmationContentProps) {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-4">
        <FadeIn className="text-center mb-8">
          <motion.div
            variants={scaleFadeVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: duration.dramatic, ease: ease.emphasized }}
          >
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          </motion.div>
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
        </FadeIn>

        {order && (
          <div className="space-y-6">
            {/* Order Items */}
            <FadeIn delay={0.1}>
              <div className="glass-panel rounded-lg p-6">
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
                    <span className="accent-gradient-text">{formatPrice(order.total, currency)}</span>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Shipping Address */}
            <FadeIn delay={0.2}>
              <div className="glass-panel rounded-lg p-6">
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
            </FadeIn>

            {/* Contact */}
            <FadeIn delay={0.3}>
              <div className="glass-panel rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <h2 className="font-semibold text-lg">Contact</h2>
                </div>
                <p className="text-sm">{order.email}</p>
                {order.phone && <p className="text-sm text-muted-foreground">{order.phone}</p>}
              </div>
            </FadeIn>
          </div>
        )}

        <FadeIn delay={0.4}>
          <div className="flex gap-4 justify-center mt-8">
            <Button asChild className="accent-gradient text-white hover:opacity-90 transition-opacity">
              <Link href="/collections">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/account/orders">View Orders</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
