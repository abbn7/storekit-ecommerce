"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Heart, Menu, X, User, LayoutDashboard } from "lucide-react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useCartStore } from "@/stores/cartStore";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { hoverScale } from "@/lib/motion";

interface NavbarProps {
  storeName?: string | null;
  logoUrl?: string | null;
}

export function Navbar({ storeName, logoUrl }: NavbarProps) {
  const { scrollDirection, scrollY } = useScrollDirection();
  const itemCount = useCartStore((s) => s.getItemCount());
  const { toggleSearch, toggleMobileMenu, toggleCart, isMobileMenuOpen } = useUIStore();
  const isScrolled = scrollY > 50;
  const isHidden = scrollDirection === "down" && scrollY > 200;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[var(--ease-emphasized)]",
        isScrolled
          ? "glass-panel shadow-sm"
          : "bg-transparent",
        isHidden && !isMobileMenuOpen ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className={cn(
              "lg:hidden p-2 -ml-2 transition-colors duration-300",
              isScrolled ? "text-foreground" : "text-white"
            )}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Left nav links */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            <Link
              href="/collections"
              className={cn(
                "text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-accent relative group",
                isScrolled ? "text-foreground" : "text-white"
              )}
            >
              Collections
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/collections?sort=newest"
              className={cn(
                "text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-accent relative group",
                isScrolled ? "text-foreground" : "text-white"
              )}
            >
              New Arrivals
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>

          {/* Logo — dynamic from storeConfig or fallback to text */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={storeName || "Store"}
                width={140}
                height={48}
                className={cn(
                  "h-8 lg:h-10 w-auto object-contain transition-all duration-300",
                  !isScrolled && "brightness-0 invert"
                )}
                priority
              />
            ) : (
              <span className={cn(
                "font-heading text-2xl lg:text-3xl font-light tracking-[0.2em] uppercase transition-colors duration-300",
                isScrolled ? "text-foreground" : "text-white"
              )}>
                {storeName || "MAISON"}
              </span>
            )}
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              onClick={toggleSearch}
              className={cn(
                "p-2 transition-colors duration-300 hover:text-accent focus-ring rounded-full",
                isScrolled ? "text-foreground" : "text-white"
              )}
              aria-label="Search"
              {...hoverScale}
            >
              <Search className="h-5 w-5" />
            </motion.button>

            <Link
              href="/account/wishlist"
              className={cn(
                "hidden sm:block p-2 transition-colors duration-300 hover:text-accent focus-ring rounded-full",
                isScrolled ? "text-foreground" : "text-white"
              )}
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <Link
              href="/account"
              className={cn(
                "hidden sm:block p-2 transition-colors duration-300 hover:text-accent focus-ring rounded-full",
                isScrolled ? "text-foreground" : "text-white"
              )}
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Dashboard access — subtle but discoverable */}
            <Link
              href="/admin/login"
              className={cn(
                "hidden sm:block p-2 transition-colors duration-300 hover:text-accent focus-ring rounded-full",
                isScrolled ? "text-foreground/50 hover:text-foreground" : "text-white/50 hover:text-white"
              )}
              aria-label="Dashboard"
              title="Dashboard"
            >
              <LayoutDashboard className="h-4 w-4" />
            </Link>

            <motion.button
              onClick={toggleCart}
              className={cn(
                "p-2 transition-colors duration-300 hover:text-accent relative focus-ring rounded-full",
                isScrolled ? "text-foreground" : "text-white"
              )}
              aria-label="Cart"
              {...hoverScale}
            >
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-white flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>
    </header>
  );
}
