import { getStoreConfig } from "@/lib/db/queries/store";
import { apiResponse, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    const config = await getStoreConfig();
    if (!config) {
      return apiError("Store configuration not found", 404);
    }

    // SECURITY: Only expose public-facing fields, not internal config like taxRate as numeric
    const publicConfig = {
      id: config.id,
      name: config.name,
      description: config.description,
      logoUrl: config.logoUrl,
      faviconUrl: config.faviconUrl,
      primaryColor: config.primaryColor,
      accentColor: config.accentColor,
      currency: config.currency,
      socialLinks: config.socialLinks,
      freeShippingThreshold: config.freeShippingThreshold,
      shippingCost: config.shippingCost,
      taxRate: config.taxRate,
    };

    return apiResponse(publicConfig);
  } catch (error) {
    console.error("Error fetching store config:", error);
    return apiError("Failed to fetch store configuration", 500);
  }
}
