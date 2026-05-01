/**
 * Reusable skeleton loading components for all store pages.
 * Uses the existing skeleton-shimmer CSS class from globals.css.
 */

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="aspect-[3/4] skeleton-shimmer rounded-lg" />
      <div className="h-4 w-3/4 skeleton-shimmer rounded" />
      <div className="h-4 w-1/2 skeleton-shimmer rounded" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-6 py-6 border-b glass-panel-strong rounded-xl p-5">
      <div className="h-32 w-24 flex-shrink-0 skeleton-shimmer rounded-lg" />
      <div className="flex-1 space-y-3">
        <div className="h-4 w-3/4 skeleton-shimmer rounded" />
        <div className="h-3 w-1/2 skeleton-shimmer rounded" />
        <div className="h-3 w-1/4 skeleton-shimmer rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-8 skeleton-shimmer rounded-md" />
          <div className="h-8 w-8 skeleton-shimmer rounded" />
          <div className="h-8 w-8 skeleton-shimmer rounded-md" />
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <div className="h-4 w-4 skeleton-shimmer rounded" />
        <div className="h-4 w-20 skeleton-shimmer rounded" />
      </div>
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="glass-panel rounded-xl p-6 space-y-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 skeleton-shimmer rounded" />
          <div className="h-3 w-24 skeleton-shimmer rounded" />
        </div>
        <div className="h-6 w-20 skeleton-shimmer rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full skeleton-shimmer rounded" />
        <div className="h-3 w-2/3 skeleton-shimmer rounded" />
      </div>
      <div className="flex justify-between pt-2">
        <div className="h-4 w-20 skeleton-shimmer rounded" />
        <div className="h-4 w-16 skeleton-shimmer rounded" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      {/* Image gallery skeleton */}
      <div className="space-y-4">
        <div className="aspect-square skeleton-shimmer rounded-2xl" />
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 w-20 skeleton-shimmer rounded-lg" />
          ))}
        </div>
      </div>
      {/* Product info skeleton */}
      <div className="space-y-6">
        <div className="h-8 w-3/4 skeleton-shimmer rounded" />
        <div className="h-6 w-24 skeleton-shimmer rounded" />
        <div className="space-y-2">
          <div className="h-4 w-full skeleton-shimmer rounded" />
          <div className="h-4 w-full skeleton-shimmer rounded" />
          <div className="h-4 w-2/3 skeleton-shimmer rounded" />
        </div>
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 w-24 skeleton-shimmer rounded-lg" />
          ))}
        </div>
        <div className="h-12 w-full skeleton-shimmer rounded-lg" />
        <div className="h-px bg-muted" />
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-8 skeleton-shimmer rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CheckoutFormSkeleton() {
  return (
    <div className="glass-panel p-8 space-y-6">
      <div className="h-8 w-48 skeleton-shimmer rounded" />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 w-20 skeleton-shimmer rounded" />
          <div className="h-10 w-full skeleton-shimmer rounded-md" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 skeleton-shimmer rounded" />
          <div className="h-10 w-full skeleton-shimmer rounded-md" />
        </div>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 skeleton-shimmer rounded" />
          <div className="h-10 w-full skeleton-shimmer rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function AccountSettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 skeleton-shimmer rounded" />
      <div className="glass-panel rounded-xl p-6 space-y-4">
        <div className="h-6 w-40 skeleton-shimmer rounded" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 skeleton-shimmer rounded" />
              <div className="h-10 w-full skeleton-shimmer rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-64 skeleton-shimmer rounded" />
      <div className="h-4 w-48 skeleton-shimmer rounded" />
      <ProductGridSkeleton count={6} />
    </div>
  );
}

export function CollectionSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="h-10 w-64 skeleton-shimmer rounded" />
        <div className="h-4 w-96 skeleton-shimmer rounded" />
      </div>
      <div className="flex gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 w-28 skeleton-shimmer rounded-lg" />
        ))}
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
