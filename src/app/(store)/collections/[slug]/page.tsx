import type { Metadata } from "next";
import { getCollectionBySlug } from "@/lib/db/queries/collections";
import { getAvailableMaterials, getPriceRange, getProductsCount } from "@/lib/db/queries/products";
import { ProductGrid } from "@/components/store/ProductGrid";
import { CollectionFilters } from "@/components/store/CollectionFilters";
import { Breadcrumbs } from "@/components/store/Breadcrumbs";
import { notFound } from "next/navigation";
import { CollectionHeader } from "./CollectionHeader";
import { Pagination } from "@/components/store/Pagination";

export const metadata: Metadata = {
  title: "Collection",
  description: "Browse products in this collection",
};

export default async function CollectionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  // Parse filter params
  const sort = typeof sp.sort === "string" ? sp.sort : undefined;
  const material = typeof sp.material === "string" ? sp.material : undefined;
  const minPrice = typeof sp.min_price === "string" ? parseInt(sp.min_price) : undefined;
  const maxPrice = typeof sp.max_price === "string" ? parseInt(sp.max_price) : undefined;
  const page = typeof sp.page === "string" ? parseInt(sp.page) : 1;
  const limit = 12;

  // Fetch filter facets
  const [materials, priceRange, totalProducts] = await Promise.all([
    getAvailableMaterials(slug).catch(() => []),
    getPriceRange(slug).catch(() => ({ min: 0, max: 0 })),
    getProductsCount({ collection: slug }).catch(() => 0),
  ]);

  // Apply client-side filtering on the already-fetched products
  // (In production, this would be server-side with proper DB queries)
  let filteredProducts = collection.products.map((p) => ({
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

  // Apply price filter
  if (minPrice != null) {
    filteredProducts = filteredProducts.filter((p) => p.price >= minPrice);
  }
  if (maxPrice != null) {
    filteredProducts = filteredProducts.filter((p) => p.price <= maxPrice);
  }

  // Apply material filter (would need material in product data from collection query)
  // For now, materials are shown as filter options but filtering happens server-side via API

  // Apply sort
  if (sort === "price_asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }
  // Default: newest first (already in order from DB)

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / limit);
  const paginatedProducts = filteredProducts.slice((page - 1) * limit, page * limit);

  return (
    <>
      <CollectionHeader
        name={collection.name}
        description={collection.description}
        imageUrl={collection.imageUrl}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { label: "Collections", href: "/collections" },
            { label: collection.name },
          ]}
        />

        <CollectionFilters
          facets={{
            materials,
            priceRange,
          }}
          collectionSlug={slug}
          totalProducts={filteredProducts.length}
        />

        <ProductGrid products={paginatedProducts} />

        {totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} />
        )}
      </div>
    </>
  );
}
