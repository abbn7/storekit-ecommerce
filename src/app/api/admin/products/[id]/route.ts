import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getProductById, updateProduct, deleteProduct } from "@/lib/db/queries/products";
import { apiResponse, apiError } from "@/lib/api-response";
import { updateProductSchema } from "@/lib/validations";
import { formatZodError } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const { id } = await params;
    const product = await getProductById(id);
    if (!product) return apiError("Product not found", 404);
    return apiResponse(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return apiError("Failed to fetch product", 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const { id } = await params;
    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(`Validation error: ${formatZodError(parsed.error)}`, 400);
    }

    // H1 FIX: Check for null return (product not found)
    const product = await updateProduct(id, parsed.data);
    if (!product) return apiError("Product not found", 404);
    return apiResponse(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return apiError("Failed to update product", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const { id } = await params;
    // H2 FIX: Check if deletion actually happened
    const deleted = await deleteProduct(id);
    if (!deleted) return apiError("Product not found", 404);
    return apiResponse({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return apiError("Failed to delete product", 500);
  }
}
