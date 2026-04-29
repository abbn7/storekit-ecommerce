import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { updateAnnouncement, deleteAnnouncement } from "@/lib/db/queries/store";
import { apiResponse, apiError } from "@/lib/api-response";
import { updateAnnouncementSchema } from "@/lib/validations";
import { formatZodError } from "@/lib/utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const { id } = await params;
    const body = await request.json();
    const parsed = updateAnnouncementSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(`Validation error: ${formatZodError(parsed.error)}`, 400);
    }

    // H1 FIX: Check for null return
    const announcement = await updateAnnouncement(id, parsed.data);
    if (!announcement) return apiError("Announcement not found", 404);
    return apiResponse(announcement);
  } catch (error) {
    console.error("Error updating announcement:", error);
    return apiError("Failed to update announcement", 500);
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
    const deleted = await deleteAnnouncement(id);
    if (!deleted) return apiError("Announcement not found", 404);
    return apiResponse({ success: true });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return apiError("Failed to delete announcement", 500);
  }
}
