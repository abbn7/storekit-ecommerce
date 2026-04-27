import { NextRequest } from "next/server";
import { getProducts } from "@/lib/db/queries/products";
import { apiResponse, apiError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "8");

    if (!query) {
      return apiResponse([]);
    }

    const results = await getProducts({ search: query, limit });
    return apiResponse(results);
  } catch (error) {
    console.error("Error searching products:", error);
    return apiError("Failed to search products", 500);
  }
}
