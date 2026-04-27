import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getProductById, updateProduct, deleteProduct } from "@/lib/db/queries/products";
import { apiResponse, apiError } from "@/lib/api-response";
import { updateProductSchema } from "@/lib/validations";

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
      const errors = parsed.error.flatten().fieldErrors;
      const message = Object.entries(errors)
        .map(([key, vals]) => `${key}: ${vals?.join(", ")}`)
        .join("; ");
      return apiError(`Validation error: ${message}`, 400);
    }

    const product = await updateProduct(id, parsed.data);
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
    await deleteProduct(id);
    return apiResponse({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return apiError("Failed to delete product", 500);
  }
}
