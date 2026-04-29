import { NextRequest } from "next/server";
import { loginAdmin, logoutAdmin, checkRateLimit, verifyAdminSession } from "@/lib/admin-auth";
import { apiResponse, apiError } from "@/lib/api-response";
import { z } from "zod";
import { formatZodError } from "@/lib/utils";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    // CRITICAL FIX: Use the most trusted IP source. Never use the leftmost x-forwarded-for
    // as it can be spoofed by the client. Vercel's x-vercel-forwarded-for is trustworthy.
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || (forwardedFor ? forwardedFor.split(",").pop()?.trim() : undefined)
      || "unknown";

    const rateCheck = await checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return apiError(
        `Too many login attempts. Try again in ${Math.ceil(rateCheck.remainingMs / 1000)} seconds.`,
        429
      );
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(`Validation error: ${formatZodError(parsed.error)}`, 400);
    }

    const result = await loginAdmin(parsed.data.password);
    if (!result.success) {
      return apiError(result.error || "Invalid credentials", 401);
    }
    return apiResponse({ success: true });
  } catch (error) {
    console.error("Admin login error:", error);
    return apiError("Login failed", 500);
  }
}

export async function GET() {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return apiError("Not authenticated", 401);
    return apiResponse({ authenticated: true });
  } catch (error) {
    console.error("Admin auth check error:", error);
    return apiError("Auth check failed", 500);
  }
}

export async function DELETE() {
  try {
    await logoutAdmin();
    return apiResponse({ success: true });
  } catch (error) {
    console.error("Admin logout error:", error);
    return apiError("Logout failed", 500);
  }
}
