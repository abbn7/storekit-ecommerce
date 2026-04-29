"use client";

import Link from "next/link";
import { Package, Heart, Settings } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/lib/motion";

export default function AccountPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="font-heading text-4xl font-light tracking-wide text-center mb-12">
            My Account
          </h1>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StaggerItem>
            <Link href="/account/orders" className="group block p-8 glass-panel rounded-xl text-center hover:glass-panel-strong transition-all">
              <Package className="h-8 w-8 mx-auto mb-4 text-muted-foreground group-hover:text-accent transition-colors" />
              <h3 className="font-heading text-lg tracking-wide mb-1">Orders</h3>
              <p className="text-sm text-muted-foreground">View your order history</p>
            </Link>
          </StaggerItem>

          <StaggerItem>
            <Link href="/account/wishlist" className="group block p-8 glass-panel rounded-xl text-center hover:glass-panel-strong transition-all">
              <Heart className="h-8 w-8 mx-auto mb-4 text-muted-foreground group-hover:text-accent transition-colors" />
              <h3 className="font-heading text-lg tracking-wide mb-1">Wishlist</h3>
              <p className="text-sm text-muted-foreground">Your saved items</p>
            </Link>
          </StaggerItem>

          <StaggerItem>
            <Link href="/account/settings" className="group block p-8 glass-panel rounded-xl text-center hover:glass-panel-strong transition-all">
              <Settings className="h-8 w-8 mx-auto mb-4 text-muted-foreground group-hover:text-accent transition-colors" />
              <h3 className="font-heading text-lg tracking-wide mb-1">Settings</h3>
              <p className="text-sm text-muted-foreground">Manage your account</p>
            </Link>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </div>
  );
}
