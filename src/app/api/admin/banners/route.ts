import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getBanners, createBanner } from "@/lib/db/queries/store";
import { apiResponse, apiError } from "@/lib/api-response";
import { createBannerSchema } from "@/lib/validations";
import { formatZodError } from "@/lib/utils";

export async function GET() {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const bannersList = await getBanners();
    return apiResponse(bannersList);
  } catch (error) {
    logger.error("Error fetching banners:", error);
    return apiError("Failed to fetch banners", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const body = await request.json();
    const parsed = createBannerSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(`Validation error: ${formatZodError(parsed.error)}`, 400);
    }

    const banner = await createBanner(parsed.data);
    return apiResponse(banner, undefined, 201);
  } catch (error) {
    logger.error("Error creating banner:", error);
    return apiError("Failed to create banner", 500);
  }
}
