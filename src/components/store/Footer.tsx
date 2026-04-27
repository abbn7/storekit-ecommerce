"use client";

import Link from "next/link";
import { FaInstagram, FaTwitter, FaFacebookF, FaPinterestP } from "react-icons/fa";
import type { IconType } from "react-icons";

const socialLinks: { icon: IconType; href: string; label: string }[] = [
  { icon: FaInstagram, href: "/instagram", label: "Instagram" },
  { icon: FaTwitter, href: "/twitter", label: "Twitter" },
  { icon: FaFacebookF, href: "/facebook", label: "Facebook" },
  { icon: FaPinterestP, href: "/pinterest", label: "Pinterest" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="font-heading text-3xl font-light tracking-[0.2em] uppercase mb-4">
              MAISON
            </h2>
            <p className="text-sm text-background/60 leading-relaxed">
              Curated luxury essentials for the modern connoisseur.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-6">
              Shop
            </h3>
            <ul className="space-y-3">
              {["All Collections", "New Arrivals", "Best Sellers", "Sale"].map((item) => (
                <li key={item}>
                  <Link
                    href="/collections"
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-6">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {["Contact Us", "Shipping & Returns", "FAQ", "Size Guide"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-6">
              Newsletter
            </h3>
            <p className="text-sm text-background/60 mb-4">
              Subscribe for exclusive access to new collections and special offers.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-background/10 border border-background/20 px-4 py-2 text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-background/50"
              />
              <button
                type="submit"
                className="bg-background text-foreground px-4 py-2 text-xs font-medium tracking-wider uppercase hover:bg-background/90 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">
            © {new Date().getFullYear()} MAISON. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                className="text-background/40 hover:text-background transition-colors"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
