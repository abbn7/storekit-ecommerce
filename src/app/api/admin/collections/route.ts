import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getAllCollections, createCollection } from "@/lib/db/queries/collections";
import { apiResponse, apiError } from "@/lib/api-response";
import { createCollectionSchema } from "@/lib/validations";

export async function GET() {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const collections = await getAllCollections();
    return apiResponse(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
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
      const errors = parsed.error.flatten().fieldErrors;
      const message = Object.entries(errors)
        .map(([key, vals]) => `${key}: ${vals?.join(", ")}`)
        .join("; ");
      return apiError(`Validation error: ${message}`, 400);
    }

    const collection = await createCollection(parsed.data);
    return apiResponse(collection, undefined, 201);
  } catch (error) {
    console.error("Error creating collection:", error);
    return apiError("Failed to create collection", 500);
  }
}
