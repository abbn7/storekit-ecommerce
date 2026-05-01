import { CheckoutFormSkeleton } from "@/components/store/Skeletons";

export default function Loading() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-40 skeleton-shimmer rounded mx-auto mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <CheckoutFormSkeleton />
          <div className="glass-panel-strong p-8 h-fit space-y-6">
            <div className="h-8 w-40 skeleton-shimmer rounded" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-32 skeleton-shimmer rounded" />
                  <div className="h-4 w-16 skeleton-shimmer rounded" />
                </div>
              ))}
            </div>
            <div className="h-px bg-muted" />
            <div className="flex justify-between">
              <div className="h-6 w-28 skeleton-shimmer rounded" />
              <div className="h-6 w-24 skeleton-shimmer rounded" />
            </div>
            <div className="h-12 w-full skeleton-shimmer rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
