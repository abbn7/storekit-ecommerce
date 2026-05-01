import { ProductDetailSkeleton } from "@/components/store/Skeletons";

export default function Loading() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="flex gap-2 mb-8">
          <div className="h-4 w-20 skeleton-shimmer rounded" />
          <div className="h-4 w-4 skeleton-shimmer rounded" />
          <div className="h-4 w-32 skeleton-shimmer rounded" />
        </div>
        <ProductDetailSkeleton />
      </div>
    </div>
  );
}
