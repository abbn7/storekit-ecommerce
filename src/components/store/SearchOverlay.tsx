"use client";

import { useReducer, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { overlayVariants, scaleFadeVariants } from "@/lib/motion";

interface SearchOverlayState {
  query: string;
  results: { id: string; name: string; slug: string; price: number; images: { url: string }[] }[];
  loading: boolean;
}

type SearchOverlayAction =
  | { type: "SET_QUERY"; query: string }
  | { type: "RESET" }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; results: SearchOverlayState["results"] }
  | { type: "FETCH_ERROR" };

const initialSearchState: SearchOverlayState = {
  query: "",
  results: [],
  loading: false,
};

function searchOverlayReducer(state: SearchOverlayState, action: SearchOverlayAction): SearchOverlayState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.query };
    case "RESET":
      return initialSearchState;
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, results: action.results, loading: false };
    case "FETCH_ERROR":
      return { ...state, results: [], loading: false };
    default:
      return state;
  }
}

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [state, dispatch] = useReducer(searchOverlayReducer, initialSearchState);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    } else {
      dispatch({ type: "RESET" });
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!state.query.trim()) {
      dispatch({ type: "FETCH_ERROR" });
      return;
    }

    const timer = setTimeout(async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(state.query)}&limit=6`);
        const data = await res.json();
        dispatch({ type: "FETCH_SUCCESS", results: data.data || [] });
      } catch {
        dispatch({ type: "FETCH_ERROR" });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [state.query]);

  const { query, results, loading } = state;

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 overlay-scrim"
        >
          <motion.div
            variants={scaleFadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mx-auto mt-6 max-w-3xl px-4 pt-24 pb-10 glass-panel-heavy rounded-2xl"
          >
            {/* Close button */}
            <button
              onClick={closeSearch}
              className="absolute top-6 right-6 p-2 hover:bg-muted rounded-full transition-colors"
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
                onChange={(e) => dispatch({ type: "SET_QUERY", query: e.target.value })}
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
                      <div className="relative h-16 w-14 flex-shrink-0 bg-muted overflow-hidden rounded-lg">
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
