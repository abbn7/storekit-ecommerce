import { NextRequest } from "next/server";
import { getProducts } from "@/lib/db/queries/products";
import { apiResponse, apiError } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/admin-auth";
import { logger } from "@/lib/logger";

// NEW-M5: Use DB-backed rate limiting instead of in-memory Map
// In-memory rate limiting doesn't work in serverless (Vercel) environments
export async function GET(request: NextRequest) {
  try {
    // Rate limiting using DB-backed approach (works across serverless instances)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || (forwardedFor ? forwardedFor.split(",").pop()?.trim() : undefined)
      || "unknown";

    const rateCheck = await checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return apiError(
        `Too many search requests. Try again in ${Math.ceil(rateCheck.remainingMs / 1000)} seconds.`,
        429
      );
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
    logger.error("Error searching products:", error);
    return apiError("Failed to search products", 500);
  }
}
