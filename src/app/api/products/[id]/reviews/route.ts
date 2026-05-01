import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { getProductReviews, createReview, checkExistingReview } from "@/lib/db/queries/reviews";
import { apiResponse, apiError } from "@/lib/api-response";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(255).optional(),
  content: z.string().max(2000).optional(),
  // NEW-H4: authorName is no longer accepted from the client — derived from Clerk profile
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const result = await getProductReviews(productId, page, limit);
    return apiResponse(result);
  } catch (error) {
    logger.error("Error fetching reviews:", error);
    return apiError("Failed to fetch reviews", 500);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return apiError("Please sign in to write a review", 401);
    }

    const { id: productId } = await params;
    const body = await request.json();
    const parsed = createReviewSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("Invalid review data", 400);
    }

    const { rating, title, content } = parsed.data;

    // NEW-H4: Derive authorName from Clerk user profile instead of accepting from client
    let authorName = "Anonymous";
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const firstName = user.firstName || "";
      const lastName = user.lastName || "";
      authorName = `${firstName} ${lastName}`.trim() || user.username || "Anonymous";
    } catch {
      // Fallback to Anonymous if Clerk lookup fails
    }

    // Check if user already reviewed this product
    const existing = await checkExistingReview(productId, userId);
    if (existing) {
      return apiError("You have already reviewed this product", 409);
    }

    const review = await createReview({
      productId,
      clerkUserId: userId,
      authorName,
      rating,
      title,
      content,
      isVerifiedPurchase: false, // TODO: check against order history
    });

    return apiResponse(review, undefined, 201);
  } catch (error) {
    logger.error("Error creating review:", error);
    return apiError("Failed to create review", 500);
  }
}
