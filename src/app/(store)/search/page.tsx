"use client";

import { useEffect, useReducer, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/store/ProductGrid";
import { Search } from "lucide-react";
import { FadeIn } from "@/lib/motion";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: { url: string; alt_text: string | null; is_primary: boolean }[];
}

interface SearchState {
  results: SearchResult[];
  loading: boolean;
}

type SearchAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; results: SearchResult[] }
  | { type: "FETCH_ERROR" };

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { results: action.results, loading: false };
    case "FETCH_ERROR":
      return { results: [], loading: false };
    default:
      return state;
  }
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  // L4 FIX: Properly type the results state
  const [state, dispatch] = useReducer(searchReducer, { results: [], loading: false });

  useEffect(() => {
    if (!query) return;
    dispatch({ type: "FETCH_START" });
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: "FETCH_SUCCESS", results: data.data || [] }))
      .catch(() => dispatch({ type: "FETCH_ERROR" }));
  }, [query]);

  const { results, loading } = state;

  return (
    <>
      <FadeIn className="text-center mb-12">
        <div className="glass-panel inline-block rounded-2xl px-8 py-6">
          <Search className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-heading text-4xl font-light tracking-wide">
            {query ? `Results for "${query}"` : "Search"}
          </h1>
        </div>
      </FadeIn>
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
