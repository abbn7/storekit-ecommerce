import { eq, and, desc, count, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { productReviews } from "@/lib/db/schema";
import type { Review, ReviewStats, ReviewWithStats } from "@/types";

export async function getProductReviews(
  productId: string,
  page: number = 1,
  limit: number = 10
): Promise<ReviewWithStats> {
  const offset = (page - 1) * limit;

  // Fetch approved reviews
  const reviews = await db
    .select()
    .from(productReviews)
    .where(
      and(
        eq(productReviews.productId, productId),
        eq(productReviews.isApproved, true)
      )
    )
    .orderBy(desc(productReviews.createdAt))
    .limit(limit + 1) // fetch one extra to check has_more
    .offset(offset);

  const hasMore = reviews.length > limit;
  const trimmedReviews = hasMore ? reviews.slice(0, limit) : reviews;

  // Fetch stats
  const stats = await getProductReviewStats(productId);

  return {
    reviews: trimmedReviews.map((r) => ({
      id: r.id,
      product_id: r.productId,
      clerk_user_id: r.clerkUserId,
      author_name: r.authorName,
      rating: r.rating,
      title: r.title,
      content: r.content,
      is_verified_purchase: r.isVerifiedPurchase,
      is_approved: r.isApproved,
      created_at: r.createdAt.toISOString(),
      updated_at: r.updatedAt.toISOString(),
    })) as Review[],
    stats,
    has_more: hasMore,
  };
}

export async function getProductReviewStats(
  productId: string
): Promise<ReviewStats> {
  // Get average rating and total count
  const [statsRow] = await db
    .select({
      averageRating: sql<number>`COALESCE(AVG(${productReviews.rating}), 0)`,
      totalReviews: count(productReviews.id),
    })
    .from(productReviews)
    .where(
      and(
        eq(productReviews.productId, productId),
        eq(productReviews.isApproved, true)
      )
    );

  // Get rating distribution
  const distribution = await db
    .select({
      rating: productReviews.rating,
      count: count(productReviews.id),
    })
    .from(productReviews)
    .where(
      and(
        eq(productReviews.productId, productId),
        eq(productReviews.isApproved, true)
      )
    )
    .groupBy(productReviews.rating);

  const ratingDistribution: Record<number, number> = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };
  for (const row of distribution) {
    ratingDistribution[row.rating] = row.count;
  }

  return {
    average_rating: Number(statsRow?.averageRating ?? 0),
    total_reviews: statsRow?.totalReviews ?? 0,
    rating_distribution: ratingDistribution,
  };
}

export async function createReview(
  data: {
    productId: string;
    clerkUserId: string;
    authorName: string;
    rating: number;
    title?: string;
    content?: string;
    isVerifiedPurchase?: boolean;
  }
) {
  const [review] = await db
    .insert(productReviews)
    .values({
      productId: data.productId,
      clerkUserId: data.clerkUserId,
      authorName: data.authorName,
      rating: data.rating,
      title: data.title || null,
      content: data.content || null,
      isVerifiedPurchase: data.isVerifiedPurchase ?? false,
      isApproved: true, // auto-approve; can be changed to false for moderation
    })
    .returning();

  return review;
}

export async function checkExistingReview(
  productId: string,
  clerkUserId: string
): Promise<boolean> {
  const [existing] = await db
    .select({ id: productReviews.id })
    .from(productReviews)
    .where(
      and(
        eq(productReviews.productId, productId),
        eq(productReviews.clerkUserId, clerkUserId)
      )
    )
    .limit(1);

  return !!existing;
}

export async function deleteReview(reviewId: string, clerkUserId: string) {
  const [deleted] = await db
    .delete(productReviews)
    .where(
      and(
        eq(productReviews.id, reviewId),
        eq(productReviews.clerkUserId, clerkUserId)
      )
    )
    .returning({ id: productReviews.id });

  return !!deleted;
}
