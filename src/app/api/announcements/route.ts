import { getActiveAnnouncements } from "@/lib/db/queries/store";
import { apiResponse, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    const announcements = await getActiveAnnouncements();
    return apiResponse(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return apiError("Failed to fetch announcements", 500);
  }
}
