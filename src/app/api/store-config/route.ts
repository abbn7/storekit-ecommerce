import { getStoreConfig } from "@/lib/db/queries/store";
import { apiResponse, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    const config = await getStoreConfig();
    if (!config) {
      return apiError("Store configuration not found", 404);
    }
    return apiResponse(config);
  } catch (error) {
    console.error("Error fetching store config:", error);
    return apiError("Failed to fetch store configuration", 500);
  }
}
