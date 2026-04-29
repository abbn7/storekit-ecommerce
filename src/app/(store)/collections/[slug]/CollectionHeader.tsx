"use client";

import { FadeIn } from "@/lib/motion";

interface CollectionHeaderProps {
  name: string;
  description: string | null;
}

export function CollectionHeader({ name, description }: CollectionHeaderProps) {
  return (
    <FadeIn className="text-center mb-16">
      <div className="glass-panel inline-block rounded-2xl px-10 py-8">
        <h1 className="font-heading text-4xl sm:text-5xl font-light tracking-wide mb-4">
          {name}
        </h1>
        {description && (
          <p className="text-muted-foreground max-w-xl mx-auto">
            {description}
          </p>
        )}
      </div>
    </FadeIn>
  );
}
