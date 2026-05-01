import { logger } from "@/lib/logger";
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="font-heading text-6xl font-light tracking-wide mb-4">Oops</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Something went wrong. Please try again.
      </p>
      <div className="flex gap-4">
        <Button
          onClick={reset}
          variant="outline"
        >
          Try Again
        </Button>
        <Button asChild className="accent-gradient text-white hover:opacity-90 transition-opacity">
          <a href="/">Return Home</a>
        </Button>
      </div>
    </div>
  );
}
