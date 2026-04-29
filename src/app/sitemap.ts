import type { MetadataRoute } from "next";
import { getAllActiveProducts } from "@/lib/db/queries/products";
import { getAllActiveCollections } from "@/lib/db/queries/collections";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://example.com";

  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  ];

  let productUrls: MetadataRoute.Sitemap = [];
  let collectionUrls: MetadataRoute.Sitemap = [];

  try {
    const [products, collections] = await Promise.all([
      getAllActiveProducts(),
      getAllActiveCollections(),
    ]);

    productUrls = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    collectionUrls = collections.map((collection) => ({
      url: `${baseUrl}/collections/${collection.slug}`,
      lastModified: collection.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to fetch dynamic sitemap entries:", error);
  }

  return [...staticUrls, ...productUrls, ...collectionUrls];
}
