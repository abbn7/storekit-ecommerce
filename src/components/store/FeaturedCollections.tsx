import Link from "next/link";
import Image from "next/image";

interface FeaturedCollectionsProps {
  collections?: {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
  }[];
}

export function FeaturedCollections({ collections }: FeaturedCollectionsProps) {
  const defaultCollections = [
    {
      id: "1",
      name: "Essentials",
      slug: "essentials",
      image_url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop",
    },
    {
      id: "2",
      name: "Outerwear",
      slug: "outerwear",
      image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop",
    },
    {
      id: "3",
      name: "Accessories",
      slug: "accessories",
      image_url: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&h=600&fit=crop",
    },
  ];

  const items = collections?.length ? collections : defaultCollections;

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl sm:text-4xl font-light tracking-wide text-center mb-12">
          Curated Collections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {items.map((collection, i) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className={`group relative overflow-hidden ${i === 0 ? "md:row-span-2 md:col-span-1" : ""}`}
            >
              <div className={`relative ${i === 0 ? "aspect-[3/4]" : "aspect-[4/3]"} overflow-hidden`}>
                {collection.image_url ? (
                  <Image
                    src={collection.image_url}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                    {collection.name}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-heading text-2xl text-white tracking-wide">
                    {collection.name}
                  </h3>
                  <span className="text-xs text-white/70 tracking-wider uppercase mt-1 block">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
