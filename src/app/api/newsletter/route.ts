import { NextRequest } from "next/server";
import { apiResponse, apiError } from "@/lib/api-response";
import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { logger } from "@/lib/logger";

const subscribeSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

// NEW-M3: Newsletter subscribers now stored in DB (works in serverless)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Invalid email", 400);
    }

    const { email } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check for existing subscriber
    const [existing] = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, normalizedEmail))
      .limit(1);

    if (existing) {
      // If previously unsubscribed, re-subscribe
      if (existing.unsubscribedAt) {
        await db
          .update(newsletterSubscribers)
          .set({ unsubscribedAt: null, subscribedAt: new Date() })
          .where(eq(newsletterSubscribers.email, normalizedEmail));
        return apiResponse({ success: true, message: "Welcome back! You've been re-subscribed." });
      }
      return apiError("This email is already subscribed", 409);
    }

    // Insert new subscriber
    await db
      .insert(newsletterSubscribers)
      .values({ email: normalizedEmail });

    return apiResponse({ success: true, message: "Successfully subscribed!" }, undefined, 201);
  } catch (error) {
    logger.error("Newsletter subscription error:", error);
    return apiError("Failed to subscribe. Please try again.", 500);
  }
}
