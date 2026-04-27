import { NextRequest } from "next/server";
import { loginAdmin, logoutAdmin, checkRateLimit } from "@/lib/admin-auth";
import { apiResponse, apiError } from "@/lib/api-response";
import { z } from "zod";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return apiError(
        `Too many login attempts. Try again in ${Math.ceil(rateCheck.remainingMs / 1000)} seconds.`,
        429
      );
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Password is required", 400);
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

export async function DELETE() {
  try {
    await logoutAdmin();
    return apiResponse({ success: true });
  } catch (error) {
    console.error("Admin logout error:", error);
    return apiError("Logout failed", 500);
  }
}
