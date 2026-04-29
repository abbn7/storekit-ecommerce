"use client";

import Link from "next/link";
import { FaInstagram, FaTwitter, FaFacebookF, FaPinterestP } from "react-icons/fa";
import type { IconType } from "react-icons";
import type { SocialLinks } from "@/types";
import { FadeIn } from "@/lib/motion";

interface FooterProps {
  socialLinks?: SocialLinks | null;
}

const defaultSocialLinks: { icon: IconType; href: string; label: string }[] = [
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: FaPinterestP, href: "https://pinterest.com", label: "Pinterest" },
];

const iconMap: Record<string, IconType> = {
  instagram: FaInstagram,
  twitter: FaTwitter,
  facebook: FaFacebookF,
  pinterest: FaPinterestP,
};

export function Footer({ socialLinks }: FooterProps) {
  const links = socialLinks
    ? Object.entries(socialLinks)
        .filter(([, url]) => url)
        .map(([platform, url]) => ({
          icon: iconMap[platform] ?? FaInstagram,
          href: url!,
          label: platform.charAt(0).toUpperCase() + platform.slice(1),
        }))
    : defaultSocialLinks;

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="font-heading text-3xl font-light tracking-[0.2em] uppercase mb-4">
              MAISON
            </h2>
            <p className="text-sm text-background/60 leading-relaxed mb-6">
              Curated luxury essentials for the modern connoisseur.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 text-xs text-background/40 hover:text-background/70 tracking-wider uppercase transition-colors"
            >
              Dashboard →
            </Link>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-6">
              Shop
            </h3>
            <ul className="space-y-3">
              {[
                { name: "All Collections", href: "/collections" },
                { name: "New Arrivals", href: "/collections?sort=newest" },
                { name: "About", href: "/about" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {item.name}
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
            <p className="text-xs text-background/40 italic">
              Newsletter subscription coming soon.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">
            © {new Date().getFullYear()} MAISON. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {links.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                className="text-background/40 hover:text-background transition-colors"
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
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
