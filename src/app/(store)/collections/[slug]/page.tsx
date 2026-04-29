import type { Metadata } from "next";
import { getCollectionBySlug } from "@/lib/db/queries/collections";
import { ProductGrid } from "@/components/store/ProductGrid";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Collection",
  description: "Browse products in this collection",
};

// M6 FIX: Fetch products from DB instead of passing empty array
export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  // Map DB camelCase results to component snake_case props
  const mappedProducts = collection.products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    images: p.images.map((img) => ({
      url: img.url,
      alt_text: img.altText,
      is_primary: img.isPrimary,
    })),
  }));

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl sm:text-5xl font-light tracking-wide text-center mb-4">
          {collection.name}
        </h1>
        {collection.description && (
          <p className="text-center text-muted-foreground mb-16">
            {collection.description}
          </p>
        )}

        <ProductGrid products={mappedProducts} />
      </div>
    </div>
  );
}
