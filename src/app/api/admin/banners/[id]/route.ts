import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { updateBanner, deleteBanner } from "@/lib/db/queries/store";
import { apiResponse, apiError } from "@/lib/api-response";
import { updateBannerSchema } from "@/lib/validations";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const { id } = await params;
    const body = await request.json();
    const parsed = updateBannerSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const message = Object.entries(errors)
        .map(([key, vals]) => `${key}: ${vals?.join(", ")}`)
        .join("; ");
      return apiError(`Validation error: ${message}`, 400);
    }

    const banner = await updateBanner(id, parsed.data);
    if (!banner) return apiError("Banner not found", 404);
    return apiResponse(banner);
  } catch (error) {
    console.error("Error updating banner:", error);
    return apiError("Failed to update banner", 500);
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
    await deleteBanner(id);
    return apiResponse({ success: true });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return apiError("Failed to delete banner", 500);
  }
}
