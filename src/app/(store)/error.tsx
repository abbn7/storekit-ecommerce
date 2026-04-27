"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="font-heading text-4xl font-light tracking-wide mb-4">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        We encountered an unexpected error. Please try again.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
