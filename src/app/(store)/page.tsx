import type { Metadata } from "next";
import { getFeaturedProducts, getNewArrivals } from "@/lib/db/queries/products";
import { getCollections } from "@/lib/db/queries/collections";
import { getActiveBanners, getActiveTestimonials } from "@/lib/db/queries/store";
import { HeroSection } from "@/components/store/HeroSection";
import { FeaturedCollections } from "@/components/store/FeaturedCollections";
import { MarqueeSection } from "@/components/store/MarqueeSection";
import { NewArrivals } from "@/components/store/NewArrivals";
import { TestimonialsSection } from "@/components/store/TestimonialsSection";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover our curated collection of luxury essentials",
};

export default async function HomePage() {
  // M4 FIX: Fetch dynamic data from DB instead of using only static fallbacks
  const [featuredProducts, newArrivalsProducts, collections, heroBanners, testimonials] = await Promise.all([
    getFeaturedProducts(8).catch(() => []),
    getNewArrivals(8).catch(() => []),
    getCollections().catch(() => []),
    getActiveBanners("hero").catch(() => []),
    getActiveTestimonials().catch(() => []),
  ]);

  const heroBanner = heroBanners[0];

  // Map DB camelCase results to component snake_case props
  const mappedCollections = collections.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image_url: c.imageUrl,
  }));

  const mappedTestimonials = testimonials.map((t) => ({
    id: t.id,
    author_name: t.authorName,
    author_title: t.authorTitle,
    content: t.content,
    avatar_url: t.avatarUrl,
    rating: t.rating,
  }));

  // Products from DB don't include images in simple queries, so provide empty arrays
  const mappedNewArrivals = newArrivalsProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    images: [] as { url: string; alt_text: string | null; is_primary: boolean }[],
    isNew: true,
  }));

  return (
    <>
      <HeroSection
        title={heroBanner?.title}
        subtitle={heroBanner?.subtitle ?? undefined}
        imageUrl={heroBanner?.imageUrl}
        ctaText={heroBanner?.linkUrl ? "Shop Now" : undefined}
        ctaLink={heroBanner?.linkUrl ?? undefined}
      />
      <FeaturedCollections collections={mappedCollections} />
      <MarqueeSection />
      {mappedNewArrivals.length > 0 && (
        <NewArrivals products={mappedNewArrivals} />
      )}
      <TestimonialsSection testimonials={mappedTestimonials} />
    </>
  );
}
