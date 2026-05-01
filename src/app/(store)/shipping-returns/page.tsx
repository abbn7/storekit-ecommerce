import type { Metadata } from "next";
import { Truck, RotateCcw, Shield, Clock, Package, Globe } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Learn about our shipping options, delivery times, and hassle-free return policy.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 block">
              Customer Care
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-light tracking-wide mb-4">
              Shipping & Returns
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              We want you to love every purchase. Here's everything you need to know about delivery and returns.
            </p>
          </div>
        </FadeIn>

        {/* Shipping Section */}
        <FadeIn delay={0.1}>
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-muted">
                <Truck className="h-5 w-5 text-accent" />
              </div>
              <h2 className="font-heading text-2xl tracking-wide">Shipping</h2>
            </div>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <StaggerItem>
                <div className="glass-panel rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-accent" />
                    <h3 className="font-medium text-sm">Standard Shipping</h3>
                  </div>
                  <p className="text-2xl font-light mb-1">Free</p>
                  <p className="text-xs text-muted-foreground">On orders over $200 · 5–7 business days</p>
                  <p className="text-xs text-muted-foreground mt-1">Under $200: flat rate $9.95</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="glass-panel rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-4 w-4 text-accent" />
                    <h3 className="font-medium text-sm">Express Shipping</h3>
                  </div>
                  <p className="text-2xl font-light mb-1">$19.95</p>
                  <p className="text-xs text-muted-foreground">2–3 business days</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="glass-panel rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="h-4 w-4 text-accent" />
                    <h3 className="font-medium text-sm">Overnight Shipping</h3>
                  </div>
                  <p className="text-2xl font-light mb-1">$34.95</p>
                  <p className="text-xs text-muted-foreground">Next business day (order by 2pm EST)</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="glass-panel rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="h-4 w-4 text-accent" />
                    <h3 className="font-medium text-sm">International</h3>
                  </div>
                  <p className="text-2xl font-light mb-1">From $15</p>
                  <p className="text-xs text-muted-foreground">10–14 business days · Rates calculated at checkout</p>
                </div>
              </StaggerItem>
            </StaggerContainer>

            <div className="glass-panel rounded-xl p-6 space-y-3 text-sm text-muted-foreground">
              <p>• All orders are processed within 1–2 business days (excluding weekends and holidays).</p>
              <p>• You will receive a shipping confirmation email with tracking information once your order has shipped.</p>
              <p>• We currently ship to over 50 countries. Duties and taxes may apply for international orders.</p>
              <p>• P.O. Box addresses are accepted for standard shipping only.</p>
            </div>
          </section>
        </FadeIn>

        {/* Returns Section */}
        <FadeIn delay={0.2}>
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-muted">
                <RotateCcw className="h-5 w-5 text-accent" />
              </div>
              <h2 className="font-heading text-2xl tracking-wide">Returns & Exchanges</h2>
            </div>

            <div className="glass-panel-strong rounded-2xl p-8 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <Shield className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-lg mb-2">30-Day Happiness Guarantee</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If you're not completely satisfied with your purchase, return it within 30 days for a full refund. 
                    Items must be unworn, unwashed, and in their original condition with all tags attached.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">How to Return</h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-foreground text-background text-xs flex items-center justify-center font-medium">1</span>
                    <span>Visit your account and navigate to "Orders"</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-foreground text-background text-xs flex items-center justify-center font-medium">2</span>
                    <span>Select the item(s) you wish to return and state the reason</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-foreground text-background text-xs flex items-center justify-center font-medium">3</span>
                    <span>Print the prepaid return label (free for US returns)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-foreground text-background text-xs flex items-center justify-center font-medium">4</span>
                    <span>Pack the items securely and drop off at your nearest carrier location</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-foreground text-background text-xs flex items-center justify-center font-medium">5</span>
                    <span>Refund will be processed within 5–7 business days after we receive your return</span>
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="font-medium mb-3">Exchanges</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Want a different size or color? Exchanges are always free. Simply initiate a return and place a new order, 
                  or contact us and we'll handle the exchange for you with priority shipping.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-3">Exceptions</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Sale items are eligible for exchange or store credit only</li>
                  <li>• Intimates and swimwear must have hygiene tags intact</li>
                  <li>• Items marked as "Final Sale" cannot be returned</li>
                  <li>• Gift cards are non-refundable</li>
                </ul>
              </div>
            </div>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
