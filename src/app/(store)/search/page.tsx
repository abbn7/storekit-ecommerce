"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/store/ProductGrid";
import { Search } from "lucide-react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => setResults(data.data || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <>
      <div className="text-center mb-12">
        <Search className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-heading text-4xl font-light tracking-wide">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
      </div>
      <ProductGrid products={results} loading={loading} />
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<ProductGrid products={[]} loading={true} />}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
