import Link from "next/link";
import { User, Package, Heart, Settings } from "lucide-react";

export default function AccountPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-light tracking-wide text-center mb-12">
          My Account
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link href="/account/orders" className="group p-8 border rounded-lg text-center hover:border-foreground transition-colors">
            <Package className="h-8 w-8 mx-auto mb-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <h3 className="font-heading text-lg tracking-wide mb-1">Orders</h3>
            <p className="text-sm text-muted-foreground">View your order history</p>
          </Link>

          <Link href="/account/wishlist" className="group p-8 border rounded-lg text-center hover:border-foreground transition-colors">
            <Heart className="h-8 w-8 mx-auto mb-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <h3 className="font-heading text-lg tracking-wide mb-1">Wishlist</h3>
            <p className="text-sm text-muted-foreground">Your saved items</p>
          </Link>

          <Link href="/account/settings" className="group p-8 border rounded-lg text-center hover:border-foreground transition-colors">
            <Settings className="h-8 w-8 mx-auto mb-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <h3 className="font-heading text-lg tracking-wide mb-1">Settings</h3>
            <p className="text-sm text-muted-foreground">Manage your account</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
