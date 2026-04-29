"use client";

import Link from "next/link";
import { X, LayoutDashboard } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { slideLeftVariants, overlayVariants } from "@/lib/motion";

export function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 overlay-scrim lg:hidden"
            onClick={closeMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Menu panel */}
      <motion.div
        variants={slideLeftVariants}
        initial="hidden"
        animate={isMobileMenuOpen ? "visible" : "hidden"}
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] lg:hidden glass-panel-strong flex flex-col"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-heading text-xl tracking-[0.15em] uppercase">Menu</span>
          <button onClick={closeMobileMenu} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-6 overflow-y-auto">
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

          {/* Dashboard access — separate section */}
          <div className="mt-10 pt-6 border-t">
            <Link
              href="/admin/login"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </div>
        </nav>
      </motion.div>
    </>
  );
}
