import { z } from "zod";

// ─── Sanitization Helpers ────────────────────────────

// Strip all HTML tags (for plain text fields)
export function stripHtml(input: string): string {
  if (!input) return input;
  return input.replace(/<[^>]*>/g, "");
}

// Sanitize HTML: remove dangerous tags and attributes (for rich text fields)
// NEW-M4: Added svg, img, video, audio, source, base, area, map to dangerous tags
// These tags can execute JS via event handlers or src attributes
const DANGEROUS_TAGS = /<(script|style|iframe|object|embed|form|input|textarea|button|link|meta|svg|img|video|audio|source|base|area|map)[\s\S]*?>[\s\S]*?<\/\1>|<(script|style|iframe|object|embed|form|input|textarea|button|link|meta|svg|img|video|audio|source|base|area|map)[^>]*\/?>/gi;
const EVENT_HANDLERS = /\s*on\w+\s*=\s*["'][^"']*["']/gi;
const JS_URLS = /javascript:/gi;
const DATA_URLS = /data:text\/html/gi;

export function sanitizeHtml(input: string): string {
  if (!input) return input;
  return input
    .replace(DANGEROUS_TAGS, "")
    .replace(EVENT_HANDLERS, "")
    .replace(JS_URLS, "")
    .replace(DATA_URLS, ""); // NEW-M4: Block data:text/html URLs
}

// ─── Product ─────────────────────────────────────────
export const createProductSchema = z.object({
  name: z.string().min(1).max(255).transform(stripHtml),
  slug: z.string().min(1).max(255).transform(stripHtml),
  description: z.string().min(1).transform(sanitizeHtml),
  shortDescription: z.string().max(500).optional().transform((val) => val ? sanitizeHtml(val) : val),
  price: z.number().int().min(0),
  compareAtPrice: z.number().int().min(0).optional(),
  cost: z.number().int().min(0).optional(),
  sku: z.string().max(100).optional().transform((val) => val ? stripHtml(val) : val),
  barcode: z.string().max(100).optional().transform((val) => val ? stripHtml(val) : val),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  material: z.string().max(255).optional().transform((val) => val ? stripHtml(val) : val),
  careInstructions: z.string().optional().transform((val) => val ? sanitizeHtml(val) : val),
  metaTitle: z.string().max(255).optional().transform((val) => val ? stripHtml(val) : val),
  metaDescription: z.string().optional().transform((val) => val ? sanitizeHtml(val) : val),
});

export const updateProductSchema = createProductSchema.partial();

// ─── Collection ──────────────────────────────────────
export const createCollectionSchema = z.object({
  name: z.string().min(1).max(255).transform(stripHtml),
  slug: z.string().min(1).max(255).transform(stripHtml),
  description: z.string().optional().transform((val) => val ? sanitizeHtml(val) : val),
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateCollectionSchema = createCollectionSchema.partial();

// ─── Order ───────────────────────────────────────────
export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "refunded"]),
});

// ─── Store Config ────────────────────────────────────
export const updateStoreConfigSchema = z.object({
  name: z.string().min(1).max(255).optional().transform((val) => val ? stripHtml(val) : val),
  description: z.string().optional().transform((val) => val ? sanitizeHtml(val) : val),
  logoUrl: z.string().url().optional().nullable(),
  faviconUrl: z.string().url().optional().nullable(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  currency: z.string().length(3).optional(),
  socialLinks: z.record(z.string(), z.string()).optional().nullable(),
  freeShippingThreshold: z.number().int().min(0).optional().nullable(),
  shippingCost: z.number().int().min(0).optional(),
  taxRate: z.string().optional(),
});

// ─── Banner ──────────────────────────────────────────
export const createBannerSchema = z.object({
  title: z.string().min(1).max(255).transform(stripHtml),
  subtitle: z.string().optional().transform((val) => val ? stripHtml(val) : val),
  imageUrl: z.string().min(1),
  linkUrl: z.string().optional(),
  position: z.enum(["hero", "middle", "bottom"]).default("hero"),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export const updateBannerSchema = createBannerSchema.partial();

// ─── Announcement ────────────────────────────────────
export const createAnnouncementSchema = z.object({
  text: z.string().min(1).transform(sanitizeHtml),
  linkUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export const updateAnnouncementSchema = createAnnouncementSchema.partial();

// ─── Testimonial ─────────────────────────────────────
export const createTestimonialSchema = z.object({
  authorName: z.string().min(1).max(255).transform(stripHtml),
  authorTitle: z.string().max(255).optional().transform((val) => val ? stripHtml(val) : val),
  content: z.string().min(1).transform(sanitizeHtml),
  avatarUrl: z.string().url().optional().nullable(),
  rating: z.number().int().min(1).max(5).default(5),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

// ─── Upload ──────────────────────────────────────────
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Magic number signatures for allowed image types (first bytes of file)
const FILE_SIGNATURES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  "image/gif": [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]], // GIF87a or GIF89a
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF...WEBP (check RIFF header + WEBP at offset 8)
};

/**
 * Validate that a file's actual content matches its declared MIME type
 * by checking magic number signatures. This prevents MIME type spoofing
 * where an attacker sets file.type to an allowed value but uploads malicious content.
 */
export async function validateFileSignature(file: File): Promise<{ valid: boolean; detectedType?: string }> {
  const buffer = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  for (const [mimeType, signatures] of Object.entries(FILE_SIGNATURES)) {
    for (const sig of signatures) {
      if (sig.length <= bytes.length) {
        let match = true;
        for (let i = 0; i < sig.length; i++) {
          if (bytes[i] !== sig[i]) {
            match = false;
            break;
          }
        }
        if (match) {
          // For WebP, also verify "WEBP" at offset 8
          if (mimeType === "image/webp") {
            if (bytes.length >= 12 &&
                bytes[8] === 0x57 && bytes[9] === 0x45 &&
                bytes[10] === 0x42 && bytes[11] === 0x50) {
              return { valid: file.type === mimeType, detectedType: mimeType };
            }
            continue;
          }
          return { valid: file.type === mimeType, detectedType: mimeType };
        }
      }
    }
  }

  return { valid: false };
}
