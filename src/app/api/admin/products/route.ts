import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getProducts, createProduct } from "@/lib/db/queries/products";
import { apiResponse, apiError } from "@/lib/api-response";
import { createProductSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const search = searchParams.get("search") || undefined;

    const products = await getProducts({ page, limit, search });
    return apiResponse(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return apiError("Failed to fetch products", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const message = Object.entries(errors)
        .map(([key, vals]) => `${key}: ${vals?.join(", ")}`)
        .join("; ");
      return apiError(`Validation error: ${message}`, 400);
    }

    const product = await createProduct(parsed.data);
    return apiResponse(product, undefined, 201);
  } catch (error) {
    console.error("Error creating product:", error);
    return apiError("Failed to create product", 500);
  }
}
