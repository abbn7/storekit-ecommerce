import Link from "next/link";
import { Package } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link href="/account" className="hover:text-foreground transition-colors">Account</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Orders</span>
        </nav>
        <h1 className="font-heading text-4xl font-light tracking-wide mb-12">Order History</h1>
        <div className="text-center py-20">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No orders yet.</p>
          <Link href="/collections" className="text-sm text-accent hover:underline mt-2 inline-block">Start shopping</Link>
        </div>
      </div>
    </div>
  );
}
