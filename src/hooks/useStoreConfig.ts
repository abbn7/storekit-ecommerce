import { logger } from "@/lib/logger";
"use client";

import { useReducer, useEffect } from "react";
import type { StoreConfig } from "@/types";

// TTL-based cache: refreshes every 5 minutes so admin updates propagate
const CACHE_TTL_MS = 5 * 60 * 1000;
let cachedConfig: StoreConfig | null = null;
let cacheTimestamp: number = 0;

interface ConfigState {
  config: StoreConfig | null;
  loading: boolean;
}

type ConfigAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; config: StoreConfig }
  | { type: "FETCH_ERROR" };

function configReducer(state: ConfigState, action: ConfigAction): ConfigState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { config: action.config, loading: false };
    case "FETCH_ERROR":
      return { ...state, loading: false };
    default:
      return state;
  }
}

function getInitialConfigState(): ConfigState {
  const now = Date.now();
  const isCacheValid = cachedConfig && (now - cacheTimestamp) < CACHE_TTL_MS;
  if (isCacheValid) {
    return { config: cachedConfig, loading: false };
  }
  return { config: cachedConfig, loading: true };
}

export function useStoreConfig() {
  const [state, dispatch] = useReducer(configReducer, undefined, getInitialConfigState);

  useEffect(() => {
    const now = Date.now();
    const isCacheValid = cachedConfig && (now - cacheTimestamp) < CACHE_TTL_MS;

    if (isCacheValid) {
      return;
    }

    dispatch({ type: "FETCH_START" });
    fetch("/api/store-config")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          cachedConfig = data.data;
          cacheTimestamp = Date.now();
          dispatch({ type: "FETCH_SUCCESS", config: data.data });
        } else {
          dispatch({ type: "FETCH_ERROR" });
        }
      })
      .catch((err) => {
        logger.error(err);
        dispatch({ type: "FETCH_ERROR" });
      });
  }, []);

  return { config: state.config, loading: state.loading };
}
