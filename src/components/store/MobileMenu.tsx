"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();

  return (
    <>
      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Menu panel */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] bg-white transform transition-transform duration-300 ease-out lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-heading text-xl tracking-[0.15em] uppercase">Menu</span>
          <button onClick={closeMobileMenu} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-6">
          <ul className="space-y-6">
            <li>
              <Link
                href="/collections"
                onClick={closeMobileMenu}
                className="text-lg font-heading tracking-wide hover:text-accent transition-colors"
              >
                Collections
              </Link>
            </li>
            <li>
              <Link
                href="/collections?sort=newest"
                onClick={closeMobileMenu}
                className="text-lg font-heading tracking-wide hover:text-accent transition-colors"
              >
                New Arrivals
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                onClick={closeMobileMenu}
                className="text-lg font-heading tracking-wide hover:text-accent transition-colors"
              >
                Search
              </Link>
            </li>
          </ul>

          <div className="mt-10 pt-6 border-t">
            <ul className="space-y-4">
              <li>
                <Link
                  href="/account"
                  onClick={closeMobileMenu}
                  className="text-sm tracking-wide hover:text-accent transition-colors"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/account/wishlist"
                  onClick={closeMobileMenu}
                  className="text-sm tracking-wide hover:text-accent transition-colors"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  onClick={closeMobileMenu}
                  className="text-sm tracking-wide hover:text-accent transition-colors"
                >
                  Orders
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}
