import { eq, and, desc, asc, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { collections, productCollections, products, productImages } from "@/lib/db/schema";

export async function getCollections() {
  return db
    .select()
    .from(collections)
    .where(eq(collections.isActive, true))
    .orderBy(asc(collections.sortOrder));
}

export async function getAllCollections() {
  return db.select().from(collections).orderBy(asc(collections.sortOrder));
}

export async function getAllActiveCollections() {
  return db
    .select({
      slug: collections.slug,
      updatedAt: collections.updatedAt,
    })
    .from(collections)
    .where(eq(collections.isActive, true));
}

export async function getCollectionBySlug(slug: string) {
  const [collection] = await db
    .select()
    .from(collections)
    .where(eq(collections.slug, slug))
    .limit(1);

  if (!collection) return null;

  const collectionProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
    })
    .from(products)
    .innerJoin(productCollections, eq(products.id, productCollections.productId))
    .where(
      and(
        eq(productCollections.collectionId, collection.id),
        eq(products.isActive, true)
      )
    )
    .orderBy(desc(products.createdAt));

  // Batch fetch images instead of N+1 queries
  const productIds = collectionProducts.map((p) => p.id);

  const allImages = productIds.length > 0
    ? await db
        .select({
          productId: productImages.productId,
          url: productImages.url,
          altText: productImages.altText,
          isPrimary: productImages.isPrimary,
        })
        .from(productImages)
        .where(inArray(productImages.productId, productIds))
    : [];

  // Group images by productId
  const imagesByProductId = new Map<string, typeof allImages>();
  for (const img of allImages) {
    const existing = imagesByProductId.get(img.productId) ?? [];
    existing.push(img);
    imagesByProductId.set(img.productId, existing);
  }

  const productsWithImages = collectionProducts.map((product) => ({
    ...product,
    images: imagesByProductId.get(product.id) ?? [],
  }));

  return { ...collection, products: productsWithImages };
}

export async function getCollectionById(id: string) {
  const [collection] = await db.select().from(collections).where(eq(collections.id, id)).limit(1);
  return collection ?? null;
}

export async function createCollection(data: typeof collections.$inferInsert) {
  const [collection] = await db.insert(collections).values(data).returning();
  return collection;
}

// H1 FIX: Return null when collection not found instead of undefined
export async function updateCollection(id: string, data: Partial<typeof collections.$inferInsert>) {
  const [collection] = await db
    .update(collections)
    .set(data)
    .where(eq(collections.id, id))
    .returning();
  return collection ?? null;
}

// H2 FIX: Return boolean indicating whether deletion actually happened
export async function deleteCollection(id: string) {
  const [deleted] = await db.delete(collections).where(eq(collections.id, id)).returning({ id: collections.id });
  return !!deleted;
}

export async function addProductToCollection(productId: string, collectionId: string) {
  await db.insert(productCollections).values({ productId, collectionId });
}

export async function removeProductFromCollection(productId: string, collectionId: string) {
  await db
    .delete(productCollections)
    .where(
      and(
        eq(productCollections.productId, productId),
        eq(productCollections.collectionId, collectionId)
      )
    );
}
