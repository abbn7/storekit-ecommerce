import { eq, desc, asc } from "drizzle-orm";
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
      eq(productCollections.collectionId, collection.id) &&
      eq(products.isActive, true)
    )
    .orderBy(desc(products.createdAt));

  // Get primary images for each product
  const productsWithImages = await Promise.all(
    collectionProducts.map(async (product) => {
      const [image] = await db
        .select({ url: productImages.url, altText: productImages.altText, isPrimary: productImages.isPrimary })
        .from(productImages)
        .where(eq(productImages.productId, product.id))
        .limit(1);
      return { ...product, images: image ? [image] : [] };
    })
  );

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

export async function updateCollection(id: string, data: Partial<typeof collections.$inferInsert>) {
  const [collection] = await db
    .update(collections)
    .set(data)
    .where(eq(collections.id, id))
    .returning();
  return collection;
}

export async function deleteCollection(id: string) {
  await db.delete(collections).where(eq(collections.id, id));
}

export async function addProductToCollection(productId: string, collectionId: string) {
  await db.insert(productCollections).values({ productId, collectionId });
}

export async function removeProductFromCollection(productId: string, collectionId: string) {
  await db
    .delete(productCollections)
    .where(
      eq(productCollections.productId, productId) &&
      eq(productCollections.collectionId, collectionId)
    );
}
