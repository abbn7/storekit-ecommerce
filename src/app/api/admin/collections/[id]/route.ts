import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getCollectionById, updateCollection, deleteCollection } from "@/lib/db/queries/collections";
import { apiResponse, apiError } from "@/lib/api-response";
import { updateCollectionSchema } from "@/lib/validations";
import { formatZodError } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const { id } = await params;
    const collection = await getCollectionById(id);
    if (!collection) return apiError("Collection not found", 404);
    return apiResponse(collection);
  } catch (error) {
    console.error("Error fetching collection:", error);
    return apiError("Failed to fetch collection", 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const { id } = await params;
    const body = await request.json();
    const parsed = updateCollectionSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(`Validation error: ${formatZodError(parsed.error)}`, 400);
    }

    // H1 FIX: Check for null return (collection not found)
    const collection = await updateCollection(id, parsed.data);
    if (!collection) return apiError("Collection not found", 404);
    return apiResponse(collection);
  } catch (error) {
    console.error("Error updating collection:", error);
    return apiError("Failed to update collection", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const { id } = await params;
    // H2 FIX: Check if deletion actually happened
    const deleted = await deleteCollection(id);
    if (!deleted) return apiError("Collection not found", 404);
    return apiResponse({ success: true });
  } catch (error) {
    console.error("Error deleting collection:", error);
    return apiError("Failed to delete collection", 500);
  }
}
