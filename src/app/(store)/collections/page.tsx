import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getCollections } from "@/lib/db/queries/collections";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse our curated collections",
};

export default async function CollectionsPage() {
  const collections = await getCollections().catch(() => []);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 block">
            Browse
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide mb-4">
            Collections
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Explore our curated selections of premium essentials
          </p>
        </div>

        {collections.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No collections available yet.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
            >
              Return home
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection, i) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className={`group relative overflow-hidden rounded-2xl ${
                  i === 0 ? "sm:col-span-2 sm:row-span-2" : ""
                }`}
              >
                <div className={`relative ${i === 0 ? "aspect-[16/10]" : "aspect-[3/4]"} overflow-hidden`}>
                  {collection.imageUrl ? (
                    <Image
                      src={collection.imageUrl}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-[var(--ease-emphasized)] group-hover:scale-110"
                      sizes={i === 0 ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 100vw, 33vw"}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-muted accent-gradient-subtle">
                      <span className="font-heading text-2xl text-muted-foreground">{collection.name}</span>
                    </div>
                  )}

                  {/* Multi-layer gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/80 group-hover:via-black/30" />

                  {/* Glass label */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="bg-white/[0.08] backdrop-blur-[18px] border border-white/[0.15] rounded-xl px-5 py-4 inline-flex items-center gap-3 transition-all duration-300 group-hover:bg-white/[0.14]">
                      <h2 className="font-heading text-xl text-white tracking-wide">
                        {collection.name}
                      </h2>
                      <ArrowRight className="h-4 w-4 text-white/60 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
                    </div>
                    {collection.description && i === 0 && (
                      <p className="text-sm text-white/60 mt-3 max-w-md">
                        {collection.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
