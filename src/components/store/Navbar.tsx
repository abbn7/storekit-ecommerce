"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Heart, Menu, X, User } from "lucide-react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useCartStore } from "@/stores/cartStore";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { scrollDirection, scrollY } = useScrollDirection();
  const itemCount = useCartStore((s) => s.getItemCount());
  const { toggleSearch, toggleMobileMenu, toggleCart, isMobileMenuOpen } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isScrolled = scrollY > 50;
  const isHidden = scrollDirection === "down" && scrollY > 200;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent",
        isHidden && !isMobileMenuOpen ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 -ml-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Left nav links */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            <Link
              href="/collections"
              className={cn(
                "text-sm font-medium tracking-wide uppercase transition-colors hover:text-accent",
                isScrolled ? "text-foreground" : "text-foreground"
              )}
            >
              Collections
            </Link>
            <Link
              href="/collections?sort=newest"
              className={cn(
                "text-sm font-medium tracking-wide uppercase transition-colors hover:text-accent",
                isScrolled ? "text-foreground" : "text-foreground"
              )}
            >
              New Arrivals
            </Link>
          </div>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0">
            <span className="font-heading text-2xl lg:text-3xl font-light tracking-[0.2em] uppercase">
              MAISON
            </span>
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={toggleSearch}
              className="p-2 transition-colors hover:text-accent"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/account/wishlist"
              className="hidden sm:block p-2 transition-colors hover:text-accent"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <Link
              href="/account"
              className="hidden sm:block p-2 transition-colors hover:text-accent"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>

            <button
              onClick={toggleCart}
              className="p-2 transition-colors hover:text-accent relative"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-white flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
