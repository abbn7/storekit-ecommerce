import { logger } from "@/lib/logger";
import { getCollections } from "@/lib/db/queries/collections";
import { apiResponse, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    const collectionsList = await getCollections();
    return apiResponse(collectionsList);
  } catch (error) {
    logger.error("Error fetching collections:", error);
    return apiError("Failed to fetch collections", 500);
  }
}
