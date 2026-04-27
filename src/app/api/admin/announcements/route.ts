import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getAnnouncements, createAnnouncement } from "@/lib/db/queries/store";
import { apiResponse, apiError } from "@/lib/api-response";
import { createAnnouncementSchema } from "@/lib/validations";

export async function GET() {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const announcementsList = await getAnnouncements();
    return apiResponse(announcementsList);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return apiError("Failed to fetch announcements", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const body = await request.json();
    const parsed = createAnnouncementSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const message = Object.entries(errors)
        .map(([key, vals]) => `${key}: ${vals?.join(", ")}`)
        .join("; ");
      return apiError(`Validation error: ${message}`, 400);
    }

    const announcement = await createAnnouncement(parsed.data);
    return apiResponse(announcement, undefined, 201);
  } catch (error) {
    console.error("Error creating announcement:", error);
    return apiError("Failed to create announcement", 500);
  }
}
