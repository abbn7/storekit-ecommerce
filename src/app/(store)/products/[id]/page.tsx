import type { Metadata } from "next";
import Link from "next/link";
import { getProductBySlug, getRelatedProducts } from "@/lib/db/queries/products";
import { ProductImageGallery } from "./ProductImageGallery";
import { AddToCartSection } from "./AddToCartSection";
import { RelatedProducts } from "@/components/store/RelatedProducts";
import { SocialShareButtons } from "@/components/store/SocialShareButtons";
import { Breadcrumbs } from "@/components/store/Breadcrumbs";
import { StickyAddToCart } from "@/components/store/StickyAddToCart";
import { RecentlyViewed, addRecentlyViewed } from "@/components/store/RecentlyViewed";
import { ProductReviews } from "@/components/store/ProductReviews";
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

  // Fetch related products
  const relatedProducts = await getRelatedProducts(product.id, 4).catch(() => []);

  const mappedRelated = relatedProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    images: ("images" in p ? (p as { images: { url: string; altText: string | null; isPrimary: boolean }[] }).images : []).map((img) => ({
      url: img.url,
      alt_text: img.altText,
      is_primary: img.isPrimary,
    })),
    isNew: "isNew" in p ? (p as { isNew: boolean }).isNew : false,
    isFeatured: "isFeatured" in p ? (p as { isFeatured: boolean }).isFeatured : false,
  }));

  // Build product URL for sharing
  const productUrl = `/products/${product.slug}`;

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: "Collections", href: "/collections" },
            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <ProductImageGallery images={product.images.map((img: { url: string; altText: string | null }) => ({ url: img.url, altText: img.altText }))} />

          {/* Product Info */}
          <div className="space-y-6">
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

            {/* Social Sharing */}
            <div className="pt-4 border-t">
              <SocialShareButtons
                productName={product.name}
                productUrl={productUrl}
              />
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts products={mappedRelated} />

        {/* Product Reviews */}
        <ProductReviews productId={product.id} />

        {/* Recently Viewed */}
        <RecentlyViewed currentProductId={product.id} />
      </div>

      {/* Sticky Add to Cart (mobile) */}
      <StickyAddToCart
        productName={product.name}
        price={product.price}
        compareAtPrice={product.compareAtPrice}
        imageUrl={primaryImage}
        productId={product.id}
        productSlug={product.slug}
        maxStock={totalStock}
      />
    </div>
  );
}
