import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { apiResponse, apiError } from "@/lib/api-response";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { count } from "drizzle-orm";

// I6 FIX: Simple in-memory cache with TTL for Clerk users
let cachedCustomers: { data: unknown[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // 1 minute

export async function GET(_request: NextRequest) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Unauthorized", 401);

    // I6 FIX: Return cached data if still valid
    const now = Date.now();
    if (cachedCustomers && (now - cachedCustomers.timestamp) < CACHE_TTL_MS) {
      return apiResponse(cachedCustomers.data);
    }

    const client = await clerkClient();
    const clerkUsers = await client.users.getUserList({
      limit: 100,
    });

    // Get order counts per clerkUserId
    const orderCounts = await db
      .select({
        clerkUserId: orders.clerkUserId,
        count: count(),
      })
      .from(orders)
      .groupBy(orders.clerkUserId);

    const countMap = new Map<string, number>();
    for (const oc of orderCounts) {
      if (oc.clerkUserId) countMap.set(oc.clerkUserId, oc.count);
    }

    const customers = clerkUsers.data.map((user) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      orderCount: countMap.get(user.id) || 0,
    }));

    // Update cache
    cachedCustomers = { data: customers, timestamp: now };

    return apiResponse(customers);
  } catch (error) {
    logger.error("Error fetching customers:", error);
    return apiError("Failed to fetch customers", 500);
  }
}
