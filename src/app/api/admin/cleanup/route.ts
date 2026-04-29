import { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { loginAttempts, processedWebhookEvents } from "@/lib/db/schema";
import { lt } from "drizzle-orm";
import { apiResponse, apiError } from "@/lib/api-response";


// M11 FIX: Cron cleanup endpoint for stale login attempts and processed webhook events
// Called by Vercel Cron (see vercel.json) or manually
export async function GET(request: NextRequest) {
  try {
    // Verify this is called by an authorized source (Vercel Cron or admin)
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      // Also allow Vercel cron calls via CRON_SECRET header
      const providedSecret = request.headers.get("x-cron-secret");
      const expectedSecret = process.env.CRON_SECRET;
      
      if (!expectedSecret || providedSecret !== expectedSecret) {
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
    console.error("Cleanup error:", error);
    return apiError("Cleanup failed", 500);
  }
}
