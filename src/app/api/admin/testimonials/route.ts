import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getTestimonials, createTestimonial } from "@/lib/db/queries/store";
import { apiResponse, apiError } from "@/lib/api-response";
import { createTestimonialSchema } from "@/lib/validations";

export async function GET() {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const testimonialsList = await getTestimonials();
    return apiResponse(testimonialsList);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return apiError("Failed to fetch testimonials", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const body = await request.json();
    const parsed = createTestimonialSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const message = Object.entries(errors)
        .map(([key, vals]) => `${key}: ${vals?.join(", ")}`)
        .join("; ");
      return apiError(`Validation error: ${message}`, 400);
    }

    const testimonial = await createTestimonial(parsed.data);
    return apiResponse(testimonial, undefined, 201);
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return apiError("Failed to create testimonial", 500);
  }
}
