export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string;
  width: number | null;
  height: number | null;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price: number;
  compare_at_price: number | null;
  stock: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  cost: number | null;
  sku: string | null;
  barcode: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  material: string | null;
  care_instructions: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductWithRelations extends Product {
  images: ProductImage[];
  variants: ProductVariant[];
  collections: CollectionMinimal[];
}

export interface CollectionMinimal {
  id: string;
  name: string;
  slug: string;
}

export interface ProductMinimal {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  images: { url: string; alt_text: string; is_primary: boolean }[];
}

export interface ProductFilters {
  collection?: string;
  min_price?: number;
  max_price?: number;
  material?: string;
  is_featured?: boolean;
  is_new?: boolean;
  search?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "name" | "bestselling";
  page?: number;
  limit?: number;
}

// ─── Reviews ──────────────────────────────────────────
export interface Review {
  id: string;
  product_id: string;
  clerk_user_id: string;
  author_name: string;
  rating: number;
  title: string | null;
  content: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<number, number>; // { 5: 12, 4: 8, ... }
}

export interface ReviewWithStats {
  reviews: Review[];
  stats: ReviewStats;
  has_more: boolean;
}
