import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getAllCollections, createCollection } from "@/lib/db/queries/collections";
import { apiResponse, apiError } from "@/lib/api-response";
import { createCollectionSchema } from "@/lib/validations";
import { formatZodError } from "@/lib/utils";

export async function GET() {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const collections = await getAllCollections();
    return apiResponse(collections);
  } catch (error) {
    logger.error("Error fetching collections:", error);
    return apiError("Failed to fetch collections", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const body = await request.json();
    const parsed = createCollectionSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(`Validation error: ${formatZodError(parsed.error)}`, 400);
    }

    const collection = await createCollection(parsed.data);
    return apiResponse(collection, undefined, 201);
  } catch (error) {
    logger.error("Error creating collection:", error);
    return apiError("Failed to create collection", 500);
  }
}
