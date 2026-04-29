import { eq, and, or, ilike, desc, asc, count, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productImages, productVariants, productCollections, collections } from "@/lib/db/schema";
import type { ProductFilters } from "@/types";

export async function getProducts(filters?: ProductFilters & { includeInactive?: boolean }) {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 12;
  const offset = (page - 1) * limit;

  const conditions = filters?.includeInactive ? [] : [eq(products.isActive, true)];

  if (filters?.collection) {
    const collectionCond = eq(collections.slug, filters.collection);
    const result = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        shortDescription: products.shortDescription,
        price: products.price,
        compareAtPrice: products.compareAtPrice,
        cost: products.cost,
        sku: products.sku,
        barcode: products.barcode,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        isNew: products.isNew,
        material: products.material,
        careInstructions: products.careInstructions,
        metaTitle: products.metaTitle,
        metaDescription: products.metaDescription,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .innerJoin(productCollections, eq(products.id, productCollections.productId))
      .innerJoin(collections, eq(productCollections.collectionId, collections.id))
      .where(and(...conditions, collectionCond))
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    // C3 FIX: Batch-fetch images for products returned by collection filter
    const productIds = result.map((p) => p.id);
    if (productIds.length > 0) {
      const allImages = await db
        .select({
          productId: productImages.productId,
          id: productImages.id,
          url: productImages.url,
          altText: productImages.altText,
          width: productImages.width,
          height: productImages.height,
          isPrimary: productImages.isPrimary,
          sortOrder: productImages.sortOrder,
        })
        .from(productImages)
        .where(inArray(productImages.productId, productIds))
        .orderBy(productImages.sortOrder);

      const imagesByProductId = new Map<string, typeof allImages>();
      for (const img of allImages) {
        const existing = imagesByProductId.get(img.productId) ?? [];
        existing.push(img);
        imagesByProductId.set(img.productId, existing);
      }

      return result.map((product) => ({
        ...product,
        images: imagesByProductId.get(product.id) ?? [],
        variants: [],
      }));
    }

    return result.map((product) => ({ ...product, images: [], variants: [] }));
  }

  if (filters?.is_featured) conditions.push(eq(products.isFeatured, true));
  if (filters?.is_new) conditions.push(eq(products.isNew, true));
  if (filters?.search) {
    // Escape special LIKE pattern characters to prevent unexpected query behavior
    const escaped = filters.search.replace(/[%_\\]/g, "\\$&");
    conditions.push(
      or(
        ilike(products.name, `%${escaped}%`),
        ilike(products.description, `%${escaped}%`)
      )!
    );
  }

  let orderBy;
  switch (filters?.sort) {
    case "price_asc":
      orderBy = asc(products.price);
      break;
    case "price_desc":
      orderBy = desc(products.price);
      break;
    case "name":
      orderBy = asc(products.name);
      break;
    default:
      orderBy = desc(products.createdAt);
  }

  const result = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // Batch-fetch images for all products to maintain consistent return shape
  const productIds = result.map((p) => p.id);
  if (productIds.length > 0) {
    const allImages = await db
      .select({
        productId: productImages.productId,
        id: productImages.id,
        url: productImages.url,
        altText: productImages.altText,
        width: productImages.width,
        height: productImages.height,
        isPrimary: productImages.isPrimary,
        sortOrder: productImages.sortOrder,
      })
      .from(productImages)
      .where(inArray(productImages.productId, productIds))
      .orderBy(productImages.sortOrder);

    const imagesByProductId = new Map<string, typeof allImages>();
    for (const img of allImages) {
      const existing = imagesByProductId.get(img.productId) ?? [];
      existing.push(img);
      imagesByProductId.set(img.productId, existing);
    }

    return result.map((product) => ({
      ...product,
      images: imagesByProductId.get(product.id) ?? [],
      variants: [],
    }));
  }

  return result.map((product) => ({ ...product, images: [], variants: [] }));
}

export async function getProductBySlug(slug: string) {
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!product) return null;

  // M2 FIX: Use Promise.all for parallel DB queries
  const [images, variants] = await Promise.all([
    db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, product.id))
      .orderBy(productImages.sortOrder),
    db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, product.id)),
  ]);

  return { ...product, images, variants };
}

export async function getProductById(id: string) {
  const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!product) return null;

  // M2 FIX: Use Promise.all for parallel DB queries
  const [images, variants] = await Promise.all([
    db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, id))
      .orderBy(productImages.sortOrder),
    db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, id)),
  ]);

  return { ...product, images, variants };
}

export async function getFeaturedProducts(limit: number = 8) {
  const safeLimit = Math.max(1, Math.min(50, limit));
  const result = await db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), eq(products.isFeatured, true)))
    .orderBy(desc(products.createdAt))
    .limit(safeLimit);

  // Batch-fetch images for consistent return shape
  const productIds = result.map((p) => p.id);
  if (productIds.length > 0) {
    const allImages = await db
      .select({
        productId: productImages.productId,
        id: productImages.id,
        url: productImages.url,
        altText: productImages.altText,
        width: productImages.width,
        height: productImages.height,
        isPrimary: productImages.isPrimary,
        sortOrder: productImages.sortOrder,
      })
      .from(productImages)
      .where(inArray(productImages.productId, productIds))
      .orderBy(productImages.sortOrder);

    const imagesByProductId = new Map<string, typeof allImages>();
    for (const img of allImages) {
      const existing = imagesByProductId.get(img.productId) ?? [];
      existing.push(img);
      imagesByProductId.set(img.productId, existing);
    }

    return result.map((product) => ({
      ...product,
      images: imagesByProductId.get(product.id) ?? [],
      variants: [],
    }));
  }

  return result.map((product) => ({ ...product, images: [], variants: [] }));
}

export async function getNewArrivals(limit: number = 8) {
  const safeLimit = Math.max(1, Math.min(50, limit));
  const result = await db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), eq(products.isNew, true)))
    .orderBy(desc(products.createdAt))
    .limit(safeLimit);

  // Batch-fetch images for consistent return shape
  const productIds = result.map((p) => p.id);
  if (productIds.length > 0) {
    const allImages = await db
      .select({
        productId: productImages.productId,
        id: productImages.id,
        url: productImages.url,
        altText: productImages.altText,
        width: productImages.width,
        height: productImages.height,
        isPrimary: productImages.isPrimary,
        sortOrder: productImages.sortOrder,
      })
      .from(productImages)
      .where(inArray(productImages.productId, productIds))
      .orderBy(productImages.sortOrder);

    const imagesByProductId = new Map<string, typeof allImages>();
    for (const img of allImages) {
      const existing = imagesByProductId.get(img.productId) ?? [];
      existing.push(img);
      imagesByProductId.set(img.productId, existing);
    }

    return result.map((product) => ({
      ...product,
      images: imagesByProductId.get(product.id) ?? [],
      variants: [],
    }));
  }

  return result.map((product) => ({ ...product, images: [], variants: [] }));
}

// C4 FIX: Added collection filter support to getProductsCount
export async function getProductsCount(filters?: ProductFilters) {
  const conditions = [eq(products.isActive, true)];
  if (filters?.is_featured) conditions.push(eq(products.isFeatured, true));
  if (filters?.is_new) conditions.push(eq(products.isNew, true));

  if (filters?.collection) {
    const [result] = await db
      .select({ count: count() })
      .from(products)
      .innerJoin(productCollections, eq(products.id, productCollections.productId))
      .innerJoin(collections, eq(productCollections.collectionId, collections.id))
      .where(and(...conditions, eq(collections.slug, filters.collection)));

    return result?.count ?? 0;
  }

  const [result] = await db
    .select({ count: count() })
    .from(products)
    .where(and(...conditions));

  return result?.count ?? 0;
}

export async function getAllActiveProducts() {
  return db
    .select({
      slug: products.slug,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .where(eq(products.isActive, true));
}

export async function createProduct(data: typeof products.$inferInsert) {
  const [product] = await db.insert(products).values(data).returning();
  return product;
}

// H1 FIX: Return null when product not found instead of undefined
export async function updateProduct(id: string, data: Partial<typeof products.$inferInsert>) {
  const [product] = await db
    .update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  return product ?? null;
}

// H2 FIX: Return boolean indicating whether deletion actually happened
export async function deleteProduct(id: string) {
  const [deleted] = await db.delete(products).where(eq(products.id, id)).returning({ id: products.id });
  return !!deleted;
}

export async function addProductImage(data: typeof productImages.$inferInsert) {
  const [image] = await db.insert(productImages).values(data).returning();
  return image;
}

export async function deleteProductImage(id: string) {
  const [deleted] = await db.delete(productImages).where(eq(productImages.id, id)).returning({ id: productImages.id });
  return !!deleted;
}

export async function addProductVariant(data: typeof productVariants.$inferInsert) {
  const [variant] = await db.insert(productVariants).values(data).returning();
  return variant;
}

export async function updateProductVariant(id: string, data: Partial<typeof productVariants.$inferInsert>) {
  const [variant] = await db
    .update(productVariants)
    .set(data)
    .where(eq(productVariants.id, id))
    .returning();
  return variant ?? null;
}

export async function deleteProductVariant(id: string) {
  const [deleted] = await db.delete(productVariants).where(eq(productVariants.id, id)).returning({ id: productVariants.id });
  return !!deleted;
}
