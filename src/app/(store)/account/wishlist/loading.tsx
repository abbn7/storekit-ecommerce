import { ProductGridSkeleton } from "@/components/store/Skeletons";

export default function Loading() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-32 skeleton-shimmer rounded mb-12" />
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  );
}
