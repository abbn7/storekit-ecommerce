import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { loginAttempts, processedWebhookEvents } from "@/lib/db/schema";
import { lt } from "drizzle-orm";
import { apiResponse, apiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";


// M11 FIX: Cron cleanup endpoint for stale login attempts and processed webhook events
// Called by Vercel Cron (see vercel.json) or manually
export async function GET(request: NextRequest) {
  try {
    // Verify this is called by an authorized source (Vercel Cron or admin)
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      // NEW-M8 FIX: Also accept Vercel cron via Authorization: Bearer CRON_SECRET header
      // Vercel crons automatically send this header when CRON_SECRET is configured
      const authHeader = request.headers.get("authorization");
      const cronSecret = request.headers.get("x-cron-secret");
      const expectedSecret = process.env.CRON_SECRET;

      const isValidCron = expectedSecret && (
        authHeader === `Bearer ${expectedSecret}` ||
        cronSecret === expectedSecret
      );

      if (!isValidCron) {
        return apiError("Unauthorized", 401);
      }
    }


    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    // Delete expired login attempts
    await db.delete(loginAttempts).where(lt(loginAttempts.expiresAt, cutoff));

    // Delete old processed webhook events
    await db.delete(processedWebhookEvents).where(lt(processedWebhookEvents.createdAt, cutoff));

    return apiResponse({ success: true, message: "Cleanup completed" });
  } catch (error) {
    logger.error("Cleanup error:", error);
    return apiError("Cleanup failed", 500);
  }
}
