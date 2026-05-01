"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { formatPrice, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type SortOption = "newest" | "price_asc" | "price_desc" | "name" | "bestselling";

interface FilterFacets {
  materials: string[];
  priceRange: { min: number; max: number };
}

interface CollectionFiltersProps {
  facets: FilterFacets;
  collectionSlug?: string;
  totalProducts: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "bestselling", label: "Best Selling" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "name", label: "Alphabetical" },
];

export function CollectionFilters({ facets, collectionSlug, totalProducts }: CollectionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = (searchParams.get("sort") as SortOption) || "newest";
  const currentMaterial = searchParams.get("material") || "";
  const currentMinPrice = searchParams.get("min_price");
  const currentMaxPrice = searchParams.get("max_price");

  const [priceRange, setPriceRange] = useState<[number, number]>([
    currentMinPrice ? parseInt(currentMinPrice) : facets.priceRange.min,
    currentMaxPrice ? parseInt(currentMaxPrice) : facets.priceRange.max,
  ]);
  const [selectedMaterial, setSelectedMaterial] = useState(currentMaterial);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    sort: true,
    price: true,
    material: true,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeFilterCount = [
    currentSort !== "newest",
    !!currentMaterial,
    currentMinPrice != null && parseInt(currentMinPrice) > facets.priceRange.min,
    currentMaxPrice != null && parseInt(currentMaxPrice) < facets.priceRange.max,
  ].filter(Boolean).length;

  const buildUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value == null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      return `${pathname}?${params.toString()}`;
    },
    [searchParams, pathname]
  );

  const applyFilters = useCallback(
    (updates: Record<string, string | null>) => {
      router.push(buildUrl(updates), { scroll: false });
    },
    [router, buildUrl]
  );

  const clearAll = () => {
    setPriceRange([facets.priceRange.min, facets.priceRange.max]);
    setSelectedMaterial("");
    router.push(pathname, { scroll: false });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <button
          onClick={() => toggleSection("sort")}
          className="flex items-center justify-between w-full text-sm font-medium tracking-wide uppercase mb-3"
        >
          Sort By
          {expandedSections.sort ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.sort && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-1">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => applyFilters({ sort: option.value === "newest" ? null : option.value })}
                    className={cn(
                      "block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                      currentSort === option.value
                        ? "bg-foreground text-background font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-sm font-medium tracking-wide uppercase mb-3"
        >
          Price Range
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-1 pt-2 pb-4">
                <Slider
                  value={priceRange}
                  min={facets.priceRange.min}
                  max={facets.priceRange.max}
                  step={Math.max(1, Math.round((facets.priceRange.max - facets.priceRange.min) / 50))}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  onValueCommit={(value) => {
                    const [min, max] = value as [number, number];
                    applyFilters({
                      min_price: min > facets.priceRange.min ? String(min) : null,
                      max_price: max < facets.priceRange.max ? String(max) : null,
                    });
                  }}
                  className="w-full"
                />
                <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator />

      {/* Material */}
      {facets.materials.length > 0 && (
        <div>
          <button
            onClick={() => toggleSection("material")}
            className="flex items-center justify-between w-full text-sm font-medium tracking-wide uppercase mb-3"
          >
            Material
            {expandedSections.material ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <AnimatePresence>
            {expandedSections.material && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-1">
                  {facets.materials.map((material) => (
                    <button
                      key={material}
                      onClick={() => {
                        setSelectedMaterial(material === selectedMaterial ? "" : material);
                        applyFilters({ material: material === selectedMaterial ? null : material });
                      }}
                      className={cn(
                        "block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                        selectedMaterial === material
                          ? "bg-foreground text-background font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-between mb-8">
      {/* Left: Product count + active filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-sm text-muted-foreground">
          {totalProducts} {totalProducts === 1 ? "product" : "products"}
        </p>
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {currentSort !== "newest" && (
              <Badge variant="secondary" className="text-xs gap-1">
                {SORT_OPTIONS.find((o) => o.value === currentSort)?.label}
                <button onClick={() => applyFilters({ sort: null })} aria-label="Remove sort filter">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {currentMaterial && (
              <Badge variant="secondary" className="text-xs gap-1">
                {currentMaterial}
                <button onClick={() => { setSelectedMaterial(""); applyFilters({ material: null }); }} aria-label="Remove material filter">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(currentMinPrice || currentMaxPrice) && (
              <Badge variant="secondary" className="text-xs gap-1">
                {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
                <button
                  onClick={() => {
                    setPriceRange([facets.priceRange.min, facets.priceRange.max]);
                    applyFilters({ min_price: null, max_price: null });
                  }}
                  aria-label="Remove price filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <button
              onClick={clearAll}
              className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Right: Sort dropdown (desktop) + Filter drawer (mobile) */}
      <div className="flex items-center gap-3">
        {/* Desktop sort */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Sort:</span>
          <select
            value={currentSort}
            onChange={(e) => applyFilters({ sort: e.target.value === "newest" ? null : e.target.value })}
            className="text-sm bg-transparent border-b border-foreground/20 py-1 focus:outline-none focus:border-foreground cursor-pointer"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile filter drawer */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="lg:hidden gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="h-4 w-4 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-heading tracking-wide">Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
            {activeFilterCount > 0 && (
              <Button variant="outline" className="w-full mt-6" onClick={clearAll}>
                Clear All Filters
              </Button>
            )}
          </SheetContent>
        </Sheet>

        {/* Desktop filter sidebar toggle */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="hidden lg:inline-flex gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="h-4 w-4 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-heading tracking-wide">Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
            {activeFilterCount > 0 && (
              <Button variant="outline" className="w-full mt-6" onClick={clearAll}>
                Clear All Filters
              </Button>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
