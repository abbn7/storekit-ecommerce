import { OrderSkeleton } from "@/components/store/Skeletons";

export default function Loading() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-48 skeleton-shimmer rounded mb-12" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
