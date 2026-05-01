import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { uploadImage } from "@/lib/cloudinary";
import { apiResponse, apiError } from "@/lib/api-response";
import { MAX_UPLOAD_SIZE, ALLOWED_MIME_TYPES } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "storekit";

    if (!file) {
      return apiError("No file provided", 400);
    }

    // Validate file size (5MB max)
    if (file.size > MAX_UPLOAD_SIZE) {
      return apiError(`File too large. Maximum size is ${MAX_UPLOAD_SIZE / 1024 / 1024}MB`, 400);
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type as typeof ALLOWED_MIME_TYPES[number])) {
      return apiError(`Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`, 400);
    }

    // Validate folder name (prevent path traversal)
    if (folder.includes("..") || folder.includes("/") || folder.includes("\\")) {
      return apiError("Invalid folder name", 400);
    }

    const result = await uploadImage(file, folder);
    return apiResponse(result, undefined, 201);
  } catch (error) {
    logger.error("Upload error:", error);
    return apiError("Failed to upload image", 500);
  }
}
