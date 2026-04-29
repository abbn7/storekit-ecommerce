"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs"; // C2 FIX: Import useAuth
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, COUNTRY_NAMES } from "@/lib/utils"; // H7 FIX: Import COUNTRY_NAMES
import { useStoreConfig } from "@/hooks/useStoreConfig"; // H6 FIX: Use store config for estimated totals
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FadeIn } from "@/lib/motion";

const COUNTRIES = Object.entries(COUNTRY_NAMES).map(([code, name]) => ({ code, name }));

export default function CheckoutPage() {
  const { userId } = useAuth(); // C2 FIX: Get Clerk user ID
  const { items, getSubtotal, clearCart } = useCartStore();
  const { config } = useStoreConfig(); // H6 FIX: Fetch store config for estimates
  const subtotal = getSubtotal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // H6 FIX: Calculate estimated shipping and tax using snake_case StoreConfig fields
  const shippingCost = config?.freeShippingThreshold && subtotal >= config.freeShippingThreshold
    ? 0
    : (config?.shippingCost ?? 0);
  const taxRate = config ? parseFloat(config.taxRate) : 0;
  const estimatedTax = Math.round(subtotal * taxRate);
  const estimatedTotal = subtotal + shippingCost + estimatedTax;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const orderData = {
      items: items.map((item) => ({
        productId: item.product_id,
        variantId: item.variant_id ?? undefined,
        quantity: item.quantity,
      })),
      email: formData.get("email") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phone: (formData.get("phone") as string) || undefined,
      // clerkUserId is NOT sent from client — server extracts it from auth() to prevent spoofing
      address: {
        addressLine1: formData.get("address") as string,
        addressLine2: (formData.get("addressLine2") as string) || undefined,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        postalCode: formData.get("zip") as string,
        country: formData.get("country") as string,
      },
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create order");
        return;
      }

      // Redirect to Stripe checkout
      if (data.data?.checkoutUrl) {
        clearCart();
        window.location.href = data.data.checkoutUrl;
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 text-center">
        <FadeIn>
          <h1 className="font-heading text-4xl font-light tracking-wide mb-4">Checkout</h1>
          <p className="text-muted-foreground">Your cart is empty.</p>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="font-heading text-4xl font-light tracking-wide text-center mb-12">
            Checkout
          </h1>
        </FadeIn>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping info */}
          <FadeIn delay={0.1}>
            <div className="glass-panel p-8 space-y-6">
              <h2 className="font-heading text-2xl tracking-wide">Shipping Information</h2>
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" required />
              </div>
              <div>
                <Label htmlFor="addressLine2">Apartment, suite, etc. (optional)</Label>
                <Input id="addressLine2" name="addressLine2" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" required />
                </div>
                <div>
                  <Label htmlFor="state">State / Province</Label>
                  <Input id="state" name="state" required />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP / Postal Code</Label>
                  <Input id="zip" name="zip" required />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  name="country"
                  required
                  defaultValue="US"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </FadeIn>

          {/* Order summary */}
          <FadeIn delay={0.2}>
            <div className="glass-panel-strong p-8 h-fit">
              <h2 className="font-heading text-2xl tracking-wide mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.product_id}-${item.variant_id}`} className="flex justify-between text-sm">
                    <span>{item.product_name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatPrice(estimatedTax)}</span>
                </div>
                {/* H6 FIX: Show estimated total including shipping and tax */}
                <div className="flex justify-between font-medium text-lg pt-2">
                  <span>Estimated Total</span>
                  <span className="accent-gradient-text">{formatPrice(estimatedTotal)}</span>
                </div>
              </div>
              <Button type="submit" className="w-full mt-6 py-6 accent-gradient text-white hover:opacity-90 transition-opacity" disabled={loading}>
                {loading ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </FadeIn>
        </form>
      </div>
    </div>
  );
}
