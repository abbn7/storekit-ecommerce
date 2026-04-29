import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getStoreConfig, updateStoreConfig } from "@/lib/db/queries/store";
import { apiResponse, apiError } from "@/lib/api-response";
import { updateStoreConfigSchema } from "@/lib/validations";
import { formatZodError } from "@/lib/utils";

export async function GET() {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const config = await getStoreConfig();
    if (!config) return apiError("Store config not found", 404);
    return apiResponse(config);
  } catch (error) {
    console.error("Error fetching store config:", error);
    return apiError("Failed to fetch store config", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const body = await request.json();
    const parsed = updateStoreConfigSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(`Validation error: ${formatZodError(parsed.error)}`, 400);
    }
    const config = await updateStoreConfig(parsed.data);
    return apiResponse(config);
  } catch (error) {
    console.error("Error updating store config:", error);
    return apiError("Failed to update store config", 500);
  }
}
