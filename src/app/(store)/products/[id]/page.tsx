import type { Metadata } from "next";
import Link from "next/link";
import { getProductBySlug } from "@/lib/db/queries/products";
import { ProductImageGallery } from "./ProductImageGallery";
import { AddToCartSection } from "./AddToCartSection";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductBySlug(id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    };
  }

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.metaDescription || product.shortDescription || product.description.slice(0, 160),
      images: product.images.length > 0 ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProductBySlug(id);

  if (!product) {
    notFound();
  }

  // Compute total stock from variants, or default to 99 if no variants
  const totalStock =
    product.variants.length > 0
      ? product.variants.reduce((sum: number, v: { stock: number }) => sum + v.stock, 0)
      : 99;

  const primaryImage = product.images.find((img: { isPrimary: boolean }) => img.isPrimary)?.url ?? product.images[0]?.url ?? "";

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/collections" className="hover:text-foreground transition-colors">Collections</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <ProductImageGallery images={product.images.map((img: { url: string; altText: string | null }) => ({ url: img.url, altText: img.altText }))} />

          {/* Product Info */}
          <AddToCartSection
            productId={product.id}
            productName={product.name}
            productSlug={product.slug}
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            description={product.description}
            material={product.material}
            careInstructions={product.careInstructions}
            imageUrl={primaryImage}
            maxStock={totalStock}
            variants={product.variants.map((v: { id: string; name: string; price: number; compareAtPrice: number | null; stock: number; isActive: boolean }) => ({
              id: v.id,
              name: v.name,
              price: v.price,
              compareAtPrice: v.compareAtPrice,
              stock: v.stock,
              isActive: v.isActive,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
