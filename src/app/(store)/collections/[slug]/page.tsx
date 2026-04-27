import type { Metadata } from "next";
import { ProductGrid } from "@/components/store/ProductGrid";

export const metadata: Metadata = {
  title: "Collection",
  description: "Browse products in this collection",
};

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Static fallback - in production this would fetch from API
  const collectionName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl sm:text-5xl font-light tracking-wide text-center mb-4">
          {collectionName}
        </h1>
        <p className="text-center text-muted-foreground mb-16">
          Explore our {collectionName.toLowerCase()} collection
        </p>

        <ProductGrid products={[]} />
      </div>
    </div>
  );
}
