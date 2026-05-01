import { CartItemSkeleton } from "@/components/store/Skeletons";

export default function Loading() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-4 w-24 skeleton-shimmer rounded mx-auto mb-3" />
          <div className="h-10 w-64 skeleton-shimmer rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CartItemSkeleton key={i} />
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="glass-panel-strong rounded-2xl p-6 space-y-6">
              <div className="h-8 w-40 skeleton-shimmer rounded" />
              <div className="space-y-3">
                <div className="h-4 w-full skeleton-shimmer rounded" />
                <div className="h-4 w-full skeleton-shimmer rounded" />
                <div className="h-4 w-3/4 skeleton-shimmer rounded" />
              </div>
              <div className="h-px bg-muted" />
              <div className="h-6 w-48 skeleton-shimmer rounded" />
              <div className="h-12 w-full skeleton-shimmer rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
