import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { getCollectionBySlug } from "@/lib/db/queries/collections";
import { apiResponse, apiError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const collection = await getCollectionBySlug(slug);
    if (!collection) {
      return apiError("Collection not found", 404);
    }
    return apiResponse(collection);
  } catch (error) {
    logger.error("Error fetching collection:", error);
    return apiError("Failed to fetch collection", 500);
  }
}
