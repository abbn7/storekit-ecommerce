"use client";

import { useState, useEffect } from "react";
import type { StoreConfig } from "@/types";

// TTL-based cache: refreshes every 5 minutes so admin updates propagate
const CACHE_TTL_MS = 5 * 60 * 1000;
let cachedConfig: StoreConfig | null = null;
let cacheTimestamp: number = 0;

export function useStoreConfig() {
  const [config, setConfig] = useState<StoreConfig | null>(cachedConfig);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const now = Date.now();
    const isCacheValid = cachedConfig && (now - cacheTimestamp) < CACHE_TTL_MS;

    if (isCacheValid) {
      setConfig(cachedConfig);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("/api/store-config")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          cachedConfig = data.data;
          cacheTimestamp = Date.now();
          setConfig(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { config, loading };
}
