"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, hoverLift } from "@/lib/motion";
import { ArrowRight } from "lucide-react";

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
        <FadeIn>
          <div className="text-center mb-14">
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 block">
              Explore
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide">
              Curated Collections
            </h2>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {items.map((collection, i) => (
            <StaggerItem key={collection.id}>
              <motion.div {...hoverLift} className="h-full">
                <Link
                  href={`/collections/${collection.slug}`}
                  className={`group relative overflow-hidden block h-full rounded-2xl ${i === 0 ? "md:row-span-2 md:col-span-1" : ""}`}
                >
                  <div className={`relative ${i === 0 ? "aspect-[3/4]" : "aspect-[4/3]"} overflow-hidden`}>
                    {collection.image_url ? (
                      <Image
                        src={collection.image_url}
                        alt={collection.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-[var(--ease-emphasized)] group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                        {collection.name}
                      </div>
                    )}

                    {/* Multi-layer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/80 group-hover:via-black/30" />

                    {/* Glass label at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="bg-white/[0.08] backdrop-blur-[18px] border border-white/[0.15] rounded-xl px-5 py-4 inline-flex items-center gap-3 transition-all duration-300 group-hover:bg-white/[0.14]">
                        <h3 className="font-heading text-xl text-white tracking-wide">
                          {collection.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-white/60 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
