import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { updateTestimonial, deleteTestimonial } from "@/lib/db/queries/store";
import { apiResponse, apiError } from "@/lib/api-response";
import { updateTestimonialSchema } from "@/lib/validations";

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
      const errors = parsed.error.flatten().fieldErrors;
      const message = Object.entries(errors)
        .map(([key, vals]) => `${key}: ${vals?.join(", ")}`)
        .join("; ");
      return apiError(`Validation error: ${message}`, 400);
    }

    const testimonial = await updateTestimonial(id, parsed.data);
    if (!testimonial) return apiError("Testimonial not found", 404);
    return apiResponse(testimonial);
  } catch (error) {
    console.error("Error updating testimonial:", error);
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
    await deleteTestimonial(id);
    return apiResponse({ success: true });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return apiError("Failed to delete testimonial", 500);
  }
}
