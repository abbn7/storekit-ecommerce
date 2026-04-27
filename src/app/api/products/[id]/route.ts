import { NextRequest } from "next/server";
import { getProductBySlug, getProductById } from "@/lib/db/queries/products";
import { apiResponse, apiError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Try slug first (public), then ID (admin)
    const product = await getProductBySlug(id) ?? await getProductById(id);

    if (!product) {
      return apiError("Product not found", 404);
    }
    return apiResponse(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return apiError("Failed to fetch product", 500);
  }
}
