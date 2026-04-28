import { NextRequest } from "next/server";
import { getProductBySlug, getProductById } from "@/lib/db/queries/products";
import { verifyAdminSession } from "@/lib/admin-auth";
import { apiResponse, apiError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Public: only active products via slug lookup
    const product = await getProductBySlug(id);

    if (product) {
      return apiResponse(product);
    }

    // Admin fallback: allow ID lookup (may include inactive products) but require auth
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return apiError("Product not found", 404);
    }

    const adminProduct = await getProductById(id);
    if (!adminProduct) {
      return apiError("Product not found", 404);
    }
    return apiResponse(adminProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    return apiError("Failed to fetch product", 500);
  }
}
