import type { Metadata } from "next";
import { getNewArrivals } from "@/lib/db/queries/products";
import { getCollections } from "@/lib/db/queries/collections";
import { getActiveBanners, getActiveTestimonials } from "@/lib/db/queries/store";
import { HeroSection } from "@/components/store/HeroSection";
import { FeaturedCollections } from "@/components/store/FeaturedCollections";
import { MarqueeSection } from "@/components/store/MarqueeSection";
import { NewArrivals } from "@/components/store/NewArrivals";
import { TestimonialsSection } from "@/components/store/TestimonialsSection";
import { NewsletterSubscription } from "@/components/store/NewsletterSubscription";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover our curated collection of luxury essentials",
};

export default async function HomePage() {
  // Fetch dynamic data from DB with graceful fallbacks
  const [newArrivalsProducts, collections, heroBanners, testimonials] = await Promise.all([
    getNewArrivals(8).catch(() => []),
    getCollections().catch(() => []),
    getActiveBanners("hero").catch(() => []),
    getActiveTestimonials().catch(() => []),
  ]);

  // Map hero banners to the new HeroSection props format
  const mappedHeroBanners = heroBanners.length > 0
    ? heroBanners.map((b) => ({
        id: b.id,
        title: b.title,
        subtitle: b.subtitle,
        imageUrl: b.imageUrl,
        ctaText: b.linkUrl ? (b.title ? "Shop Now" : undefined) : undefined,
        ctaLink: b.linkUrl,
      }))
    : [
        // Fallback when no banners exist in DB
        {
          title: "The New Collection",
          subtitle: "Timeless pieces crafted with intention",
          imageUrl:
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop",
          ctaText: "Shop Now" as const,
          ctaLink: "/collections" as const,
        },
      ];

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

  // Products now include images from getNewArrivals (batch-fetched)
  const mappedNewArrivals = newArrivalsProducts.map((p) => ({
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
    isNew: true,
  }));

  return (
    <>
      <HeroSection banners={mappedHeroBanners} />
      <FeaturedCollections collections={mappedCollections} />
      <MarqueeSection />
      {mappedNewArrivals.length > 0 && (
        <NewArrivals products={mappedNewArrivals} />
      )}
      <TestimonialsSection testimonials={mappedTestimonials} />
      <NewsletterSubscription variant="section" className="py-16" />
    </>
  );
}
