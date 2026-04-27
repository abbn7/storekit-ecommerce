"use client";

import { useState, useEffect } from "react";
import type { StoreConfig } from "@/types";

let cachedConfig: StoreConfig | null = null;

export function useStoreConfig() {
  const [config, setConfig] = useState<StoreConfig | null>(cachedConfig);
  const [loading, setLoading] = useState(!cachedConfig);

  useEffect(() => {
    if (cachedConfig) {
      setConfig(cachedConfig);
      setLoading(false);
      return;
    }

    fetch("/api/store-config")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          cachedConfig = data.data;
          setConfig(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { config, loading };
}
