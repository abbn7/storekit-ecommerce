import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse our curated collections",
};

export default async function CollectionsPage() {
  // Static fallback collections
  const collections = [
    {
      id: "1",
      name: "Essentials",
      slug: "essentials",
      description: "Timeless basics for every wardrobe",
      image_url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop",
    },
    {
      id: "2",
      name: "Outerwear",
      slug: "outerwear",
      description: "Crafted layers for every season",
      image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop",
    },
    {
      id: "3",
      name: "Accessories",
      slug: "accessories",
      description: "The finishing touches",
      image_url: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&h=600&fit=crop",
    },
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl sm:text-5xl font-light tracking-wide text-center mb-4">
          Collections
        </h1>
        <p className="text-center text-muted-foreground mb-16">
          Explore our curated selections
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group relative aspect-[3/4] overflow-hidden"
            >
              {collection.image_url ? (
                <Image
                  src={collection.image_url}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-muted">
                  {collection.name}
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h2 className="font-heading text-3xl text-white tracking-wide mb-1">
                  {collection.name}
                </h2>
                {collection.description && (
                  <p className="text-sm text-white/70">{collection.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
