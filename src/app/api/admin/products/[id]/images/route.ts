import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { addProductImage } from "@/lib/db/queries/products";
import { apiResponse, apiError } from "@/lib/api-response";
import { z } from "zod";
import { formatZodError } from "@/lib/utils";

const imageSchema = z.object({
  url: z.string().url(),
  altText: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  isPrimary: z.boolean().default(true),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const { id } = await params;
    const body = await request.json();
    const parsed = imageSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(`Validation error: ${formatZodError(parsed.error)}`, 400);
    }

    const image = await addProductImage({
      productId: id,
      url: parsed.data.url,
      altText: parsed.data.altText || null,
      width: parsed.data.width || null,
      height: parsed.data.height || null,
      isPrimary: parsed.data.isPrimary,
      sortOrder: 0,
    });

    return apiResponse(image, undefined, 201);
  } catch (error) {
    console.error("Error adding product image:", error);
    return apiError("Failed to add image", 500);
  }
}
