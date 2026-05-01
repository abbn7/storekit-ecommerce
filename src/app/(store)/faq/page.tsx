import type { Metadata } from "next";
import { FadeIn, StaggerContainer, StaggerItem } from "@/lib/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Find answers to frequently asked questions about orders, shipping, returns, and more.",
};

const FAQ_CATEGORIES = [
  {
    title: "Orders & Shipping",
    items: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping takes 5–7 business days within the US. Express shipping (2–3 business days) and overnight shipping are also available at checkout. International orders typically take 10–14 business days.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer complimentary standard shipping on all orders over $200. For orders under $200, a flat shipping rate of $9.95 applies.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. Once your order ships, you'll receive a confirmation email with a tracking number. You can also view your order status in your account under 'Orders'.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination and are calculated at checkout.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "You can modify or cancel your order within 1 hour of placing it. After that, we begin processing and cannot guarantee changes. Please contact us immediately if you need to make adjustments.",
      },
    ],
  },
  {
    title: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return policy on all unworn items in their original condition with tags attached. Sale items are eligible for exchange or store credit only.",
      },
      {
        q: "How do I initiate a return?",
        a: "Visit your account's order history, select the item you'd like to return, and follow the prompts. You'll receive a prepaid return label via email within 24 hours.",
      },
      {
        q: "How long do refunds take?",
        a: "Refunds are processed within 5–7 business days after we receive your return. The credit will appear on your original payment method within one billing cycle.",
      },
      {
        q: "Can I exchange for a different size?",
        a: "Yes! Exchanges are free. Simply initiate a return and place a new order for the desired size, or contact us and we'll handle the exchange for you.",
      },
    ],
  },
  {
    title: "Products & Care",
    items: [
      {
        q: "How do I find my size?",
        a: "Check our Size Guide page for detailed measurements and fitting tips. If you're between sizes, we generally recommend sizing up for a comfortable fit.",
      },
      {
        q: "What materials do you use?",
        a: "We source premium materials including organic cotton, merino wool, Italian leather, and sustainable fabrics. Each product page lists the specific materials used.",
      },
      {
        q: "How should I care for my items?",
        a: "Care instructions are listed on each product page and on the garment's care label. In general, we recommend gentle washing, air drying, and storing items properly to maintain their quality.",
      },
    ],
  },
  {
    title: "Account & Payment",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We use industry-standard SSL encryption and process payments through Stripe, which is PCI DSS compliant. We never store your full card details on our servers.",
      },
      {
        q: "Do you offer gift cards?",
        a: "Gift cards are coming soon! Sign up for our newsletter to be the first to know when they launch.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 block">
              Help Center
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-light tracking-wide mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Find quick answers to common questions. Can't find what you're looking for?{" "}
              <a href="/contact" className="text-accent hover:underline">Contact us</a>.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="space-y-10">
          {FAQ_CATEGORIES.map((category) => (
            <StaggerItem key={category.title}>
              <h2 className="font-heading text-xl tracking-wide mb-4">{category.title}</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {category.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`${category.title}-${i}`}
                    className="glass-panel rounded-xl px-6 border-0 data-[state=open]:glass-panel-strong"
                  >
                    <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
