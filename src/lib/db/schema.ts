import {
  pgTable,
  uuid,
  text,
  varchar,
  boolean,
  integer,
  numeric,
  timestamp,
  jsonb,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";

// ─── Store Config ─────────────────────────────────────
export const storeConfig = pgTable("store_config", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  primaryColor: varchar("primary_color", { length: 7 }).notNull().default("#000000"),
  accentColor: varchar("accent_color", { length: 7 }).notNull().default("#C8A96E"),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  socialLinks: jsonb("social_links").$type<Record<string, string>>(),
  freeShippingThreshold: integer("free_shipping_threshold"),
  shippingCost: integer("shipping_cost").notNull().default(0),
  taxRate: numeric("tax_rate", { precision: 5, scale: 4 }).notNull().default("0.0000"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Products ─────────────────────────────────────────
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  price: integer("price").notNull(),
  compareAtPrice: integer("compare_at_price"),
  cost: integer("cost"),
  sku: varchar("sku", { length: 100 }),
  barcode: varchar("barcode", { length: 100 }),
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  material: varchar("material", { length: 255 }),
  careInstructions: text("care_instructions"),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("products_slug_idx").on(table.slug),
  index("products_active_idx").on(table.isActive),
  index("products_featured_idx").on(table.isFeatured),
]);

export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  altText: text("alt_text"),
  width: integer("width"),
  height: integer("height"),
  isPrimary: boolean("is_primary").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
}, (table) => [
  index("product_images_product_idx").on(table.productId),
]);

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 100 }),
  price: integer("price").notNull(),
  compareAtPrice: integer("compare_at_price"),
  stock: integer("stock").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
}, (table) => [
  index("product_variants_product_idx").on(table.productId),
]);

export const productCollections = pgTable("product_collections", {
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  collectionId: uuid("collection_id").notNull().references(() => collections.id, { onDelete: "cascade" }),
}, (table) => [
  primaryKey({ columns: [table.productId, table.collectionId] }),
]);

// ─── Collections ──────────────────────────────────────
export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("collections_slug_idx").on(table.slug),
  index("collections_active_idx").on(table.isActive),
]);

// ─── Orders ───────────────────────────────────────────
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  addressLine1: varchar("address_line1", { length: 255 }).notNull(),
  addressLine2: varchar("address_line2", { length: 255 }),
  city: varchar("city", { length: 255 }).notNull(),
  state: varchar("state", { length: 255 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  subtotal: integer("subtotal").notNull(),
  shippingCost: integer("shipping_cost").notNull().default(0),
  tax: integer("tax").notNull().default(0),
  total: integer("total").notNull(),
  stripeSessionId: varchar("stripe_session_id", { length: 255 }),
  clerkUserId: varchar("clerk_user_id", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("orders_status_idx").on(table.status),
  index("orders_clerk_user_idx").on(table.clerkUserId),
  index("orders_stripe_session_idx").on(table.stripeSessionId),
]);

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  variantId: uuid("variant_id"),
  productName: varchar("product_name", { length: 255 }).notNull(),
  variantName: varchar("variant_name", { length: 255 }),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
  total: integer("total").notNull(),
}, (table) => [
  index("order_items_order_idx").on(table.orderId),
]);

// ─── Content ──────────────────────────────────────────
export const banners = pgTable("banners", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: text("subtitle"),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url"),
  position: varchar("position", { length: 50 }).notNull().default("hero"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  text: text("text").notNull(),
  linkUrl: text("link_url"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorTitle: varchar("author_title", { length: 255 }),
  content: text("content").notNull(),
  avatarUrl: text("avatar_url"),
  rating: integer("rating").notNull().default(5),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ─── Security ─────────────────────────────────────────
export const loginAttempts = pgTable("login_attempts", {
  ip: varchar("ip", { length: 45 }).primaryKey(),
  count: integer("count").notNull().default(1),
  lastAttempt: timestamp("last_attempt").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull().defaultNow(),
});

export const processedWebhookEvents = pgTable("processed_webhook_events", {
  eventId: varchar("event_id", { length: 255 }).primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
