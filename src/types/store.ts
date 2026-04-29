export interface StoreConfig {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  accentColor: string;
  currency: string;
  socialLinks: SocialLinks | null;
  freeShippingThreshold: number | null;
  shippingCost: number;
  // PostgreSQL numeric type returns strings; use parseFloat() when computing
  taxRate: string;
  updatedAt: string;
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  tiktok?: string;
  pinterest?: string;
}

export interface StoreTheme {
  primaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  fontDisplay: string;
}

export interface Announcement {
  id: string;
  text: string;
  linkUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  position: "hero" | "middle" | "bottom";
  isActive: boolean;
  sortOrder: number;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorTitle: string | null;
  content: string;
  avatarUrl: string | null;
  rating: number;
  isActive: boolean;
  sortOrder: number;
}
