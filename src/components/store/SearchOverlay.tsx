"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { formatPrice } from "@/lib/utils";

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { id: string; name: string; slug: string; price: number; images: { url: string }[] }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        setResults(data.data || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="mx-auto max-w-3xl px-4 pt-24">
        {/* Close button */}
        <button
          onClick={closeSearch}
          className="absolute top-6 right-6 p-2 hover:bg-muted rounded-full"
          aria-label="Close search"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-8 pr-4 py-4 text-2xl font-heading font-light border-b-2 border-foreground bg-transparent focus:outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Results */}
        <div className="mt-8">
          {loading && (
            <p className="text-sm text-muted-foreground">Searching...</p>
          )}
          {!loading && results.length > 0 && (
            <div className="space-y-4">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={closeSearch}
                  className="flex items-center gap-4 p-3 hover:bg-muted rounded-lg transition-colors"
                >
                  <div className="relative h-16 w-14 flex-shrink-0 bg-muted overflow-hidden">
                    {product.images[0]?.url && (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={closeSearch}
                className="block text-center text-sm text-muted-foreground hover:text-foreground py-4 transition-colors"
              >
                View all results →
              </Link>
            </div>
          )}
          {!loading && query && results.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No products found for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
