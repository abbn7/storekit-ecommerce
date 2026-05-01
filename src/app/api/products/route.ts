import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { getProducts, getProductsCount } from "@/lib/db/queries/products";
import { apiPaginatedResponse, apiError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const collection = searchParams.get("collection") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort = (searchParams.get("sort") as "newest" | "price_asc" | "price_desc" | "name") || undefined;
    const isFeatured = searchParams.get("featured") === "true";
    const isNew = searchParams.get("new") === "true";

    const [products, total] = await Promise.all([
      getProducts({ page, limit, collection, search, sort, is_featured: isFeatured, is_new: isNew }),
      getProductsCount({ is_featured: isFeatured, is_new: isNew }),
    ]);

    return apiPaginatedResponse(products, page, limit, total);
  } catch (error) {
    logger.error("Error fetching products:", error);
    return apiError("Failed to fetch products", 500);
  }
}
