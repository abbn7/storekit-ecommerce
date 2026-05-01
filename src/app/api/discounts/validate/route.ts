import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { validateDiscountCode } from "@/lib/db/queries/discounts";
import { apiResponse, apiError } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/admin-auth";
import { z } from "zod";

const validateSchema = z.object({
  code: z.string().min(1).max(100),
  subtotal: z.number().int().min(0),
});

// NEW-H3: Rate limiting for discount code validation to prevent brute-force attacks
export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP using the same DB-backed rate limiter as admin auth
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || (forwardedFor ? forwardedFor.split(",").pop()?.trim() : undefined)
      || "unknown";

    const rateCheck = await checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return apiError(
        `Too many attempts. Try again in ${Math.ceil(rateCheck.remainingMs / 1000)} seconds.`,
        429
      );
    }

    const body = await request.json();
    const parsed = validateSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("Invalid request: code and subtotal required", 400);
    }

    const { code, subtotal } = parsed.data;
    const result = await validateDiscountCode(code, subtotal);

    return apiResponse(result);
  } catch (error) {
    logger.error("Error validating discount code:", error);
    return apiError("Failed to validate discount code", 500);
  }
}
