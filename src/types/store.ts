export interface StoreConfig {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  accent_color: string;
  currency: string;
  social_links: SocialLinks | null;
  free_shipping_threshold: number | null;
  shipping_cost: number;
  // PostgreSQL numeric type returns strings; use parseFloat() when computing
  tax_rate: string;
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  tiktok?: string;
  pinterest?: string;
}

export interface StoreTheme {
  primary_color: string;
  accent_color: string;
  font_heading: string;
  font_body: string;
  font_display: string;
}

export interface Announcement {
  id: string;
  text: string;
  link_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  position: "hero" | "middle" | "bottom";
  is_active: boolean;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_title: string | null;
  content: string;
  avatar_url: string | null;
  rating: number;
  is_active: boolean;
  sort_order: number;
}
