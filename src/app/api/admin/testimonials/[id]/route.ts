import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { updateTestimonial, deleteTestimonial } from "@/lib/db/queries/store";
import { apiResponse, apiError } from "@/lib/api-response";
import { updateTestimonialSchema } from "@/lib/validations";
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
    const parsed = updateTestimonialSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(`Validation error: ${formatZodError(parsed.error)}`, 400);
    }

    // H1 FIX: Check for null return
    const testimonial = await updateTestimonial(id, parsed.data);
    if (!testimonial) return apiError("Testimonial not found", 404);
    return apiResponse(testimonial);
  } catch (error) {
    logger.error("Error updating testimonial:", error);
    return apiError("Failed to update testimonial", 500);
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
    const deleted = await deleteTestimonial(id);
    if (!deleted) return apiError("Testimonial not found", 404);
    return apiResponse({ success: true });
  } catch (error) {
    logger.error("Error deleting testimonial:", error);
    return apiError("Failed to delete testimonial", 500);
  }
}
