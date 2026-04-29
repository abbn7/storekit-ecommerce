/**
 * Centralized logger utility
 * Suppresses logs in test environment, shows errors in production, everything in dev
 */
export const logger = {
  error: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== "test") {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== "test") {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  debug: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
};
