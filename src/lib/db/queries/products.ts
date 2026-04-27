import { eq, and, or, ilike, desc, asc, sql, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productImages, productVariants, productCollections, collections } from "@/lib/db/schema";
import type { ProductFilters } from "@/types";

export async function getProducts(filters?: ProductFilters) {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 12;
  const offset = (page - 1) * limit;

  const conditions = [eq(products.isActive, true)];

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

    return result;
  }

  if (filters?.is_featured) conditions.push(eq(products.isFeatured, true));
  if (filters?.is_new) conditions.push(eq(products.isNew, true));
  if (filters?.search) {
    conditions.push(
      or(
        ilike(products.name, `%${filters.search}%`),
        ilike(products.description, `%${filters.search}%`)
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

  return result;
}

export async function getProductBySlug(slug: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);

  if (!product) return null;

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(asc(productImages.sortOrder));

  const variants = await db
    .select()
    .from(productVariants)
    .where(and(eq(productVariants.productId, product.id), eq(productVariants.isActive, true)));

  const productCollectionsList = await db
    .select({ id: collections.id, name: collections.name, slug: collections.slug })
    .from(collections)
    .innerJoin(productCollections, eq(collections.id, productCollections.collectionId))
    .where(eq(productCollections.productId, product.id));

  return {
    ...product,
    images,
    variants,
    collections: productCollectionsList,
  };
}

export async function getProductById(id: string) {
  const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!product) return null;

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, id))
    .orderBy(asc(productImages.sortOrder));

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, id));

  return { ...product, images, variants };
}

export async function getFeaturedProducts(limit: number = 8) {
  return db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), eq(products.isFeatured, true)))
    .orderBy(desc(products.createdAt))
    .limit(limit);
}

export async function getNewArrivals(limit: number = 8) {
  return db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), eq(products.isNew, true)))
    .orderBy(desc(products.createdAt))
    .limit(limit);
}

export async function getProductsCount(filters?: ProductFilters) {
  const conditions = [eq(products.isActive, true)];
  if (filters?.is_featured) conditions.push(eq(products.isFeatured, true));
  if (filters?.is_new) conditions.push(eq(products.isNew, true));

  const [result] = await db
    .select({ count: count() })
    .from(products)
    .where(and(...conditions));

  return result?.count ?? 0;
}

export async function createProduct(data: typeof products.$inferInsert) {
  const [product] = await db.insert(products).values(data).returning();
  return product;
}

export async function updateProduct(id: string, data: Partial<typeof products.$inferInsert>) {
  const [product] = await db
    .update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  return product;
}

export async function deleteProduct(id: string) {
  await db.delete(products).where(eq(products.id, id));
}

export async function addProductImage(data: typeof productImages.$inferInsert) {
  const [image] = await db.insert(productImages).values(data).returning();
  return image;
}

export async function deleteProductImage(id: string) {
  await db.delete(productImages).where(eq(productImages.id, id));
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
  return variant;
}

export async function deleteProductVariant(id: string) {
  await db.delete(productVariants).where(eq(productVariants.id, id));
}
