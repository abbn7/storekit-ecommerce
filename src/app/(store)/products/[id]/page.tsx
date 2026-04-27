import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductImageGallery } from "./ProductImageGallery";
import { AddToCartSection } from "./AddToCartSection";

export const metadata: Metadata = {
  title: "Product",
  description: "Product details",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // In production, fetch from API. For now, show a placeholder.
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/collections" className="hover:text-foreground transition-colors">Collections</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Product</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <ProductImageGallery />

          {/* Product Info */}
          <AddToCartSection productId={id} />
        </div>
      </div>
    </div>
  );
}
