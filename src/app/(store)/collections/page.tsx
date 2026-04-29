import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getCollections } from "@/lib/db/queries/collections";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse our curated collections",
};

export default async function CollectionsPage() {
  const collections = await getCollections().catch(() => []);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl sm:text-5xl font-light tracking-wide text-center mb-4">
          Collections
        </h1>
        <p className="text-center text-muted-foreground mb-16">
          Explore our curated selections
        </p>

        {collections.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No collections available yet.</p>
            <Link href="/" className="text-sm text-accent hover:underline mt-2 inline-block">
              Return home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl"
              >
                {collection.imageUrl ? (
                  <Image
                    src={collection.imageUrl}
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
                  <div className="glass-panel rounded-lg px-4 py-3 inline-block">
                    <h2 className="font-heading text-2xl text-white tracking-wide mb-1">
                      {collection.name}
                    </h2>
                    {collection.description && (
                      <p className="text-sm text-white/70">{collection.description}</p>
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
