import { NextRequest } from "next/server";
import { getProducts } from "@/lib/db/queries/products";
import { apiResponse, apiError } from "@/lib/api-response";

// Simple in-memory rate limit for search API
const searchRateLimit = new Map<string, { count: number; resetAt: number }>();
const SEARCH_RATE_LIMIT = 30; // requests per window
const SEARCH_RATE_WINDOW_MS = 60 * 1000; // 1 minute

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";
    const now = Date.now();
    const record = searchRateLimit.get(ip);
    if (!record || now > record.resetAt) {
      searchRateLimit.set(ip, { count: 1, resetAt: now + SEARCH_RATE_WINDOW_MS });
    } else if (record.count >= SEARCH_RATE_LIMIT) {
      return apiError("Too many search requests. Please try again later.", 429);
    } else {
      record.count++;
    }

    // Clean up old entries periodically (prevent memory leak)
    if (searchRateLimit.size > 1000) {
      for (const [key, val] of searchRateLimit) {
        if (now > val.resetAt) searchRateLimit.delete(key);
      }
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "8")));

    if (!query) {
      return apiResponse([]);
    }

    // Limit query length to prevent abuse
    const trimmedQuery = query.slice(0, 200);

    const results = await getProducts({ search: trimmedQuery, limit });
    return apiResponse(results);
  } catch (error) {
    console.error("Error searching products:", error);
    return apiError("Failed to search products", 500);
  }
}
