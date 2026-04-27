import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { updateAnnouncement, deleteAnnouncement } from "@/lib/db/queries/store";
import { apiResponse, apiError } from "@/lib/api-response";
import { updateAnnouncementSchema } from "@/lib/validations";

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
      const errors = parsed.error.flatten().fieldErrors;
      const message = Object.entries(errors)
        .map(([key, vals]) => `${key}: ${vals?.join(", ")}`)
        .join("; ");
      return apiError(`Validation error: ${message}`, 400);
    }

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
    await deleteAnnouncement(id);
    return apiResponse({ success: true });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return apiError("Failed to delete announcement", 500);
  }
}
