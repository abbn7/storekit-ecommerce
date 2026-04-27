import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderConfirmationPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h1 className="font-heading text-4xl font-light tracking-wide mb-4">
          Thank You!
        </h1>
        <p className="text-muted-foreground mb-2">
          Your order has been placed successfully.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          You will receive a confirmation email shortly with your order details.
        </p>
        <div className="flex gap-4 justify-center">
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
