import { logger } from "@/lib/logger";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/admin-auth";

const isProtectedRoute = createRouteMatcher([
  "/checkout(.*)",
  "/account(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
]);

const isAdminLoginRoute = createRouteMatcher([
  "/admin/login",
]);

// Create the Clerk middleware handler
const clerkHandler = clerkMiddleware(async (auth, req) => {
  // Protect Clerk-authenticated routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Protect admin routes (HMAC cookie check)
  if (isAdminRoute(req) && !isAdminLoginRoute(req)) {
    const adminToken = req.cookies.get("admin_token")?.value;

    if (!adminToken) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verify the HMAC token
    try {
      const isValid = await verifyAdminToken(adminToken);
      if (!isValid) {
        const loginUrl = new URL("/admin/login", req.url);
        loginUrl.searchParams.set("redirect_url", req.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      logger.error("[Admin Auth Error]", error);
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

// Wrap Clerk middleware with error handling so invalid keys don't crash the app
export default async function middleware(req: NextRequest) {
  try {
    const response = await clerkHandler(req, {} as Parameters<typeof clerkHandler>[1]);

    // If Clerk returns an error response (e.g., 404 from invalid secret key),
    // fall through to allow the page to render normally instead of showing a blank page
    if (response && response.status >= 400 && response.status !== 401 && response.status !== 307 && response.status !== 302) {
      logger.warn(`[Middleware] Clerk returned status ${response.status}, falling through to allow page render`);
      return NextResponse.next();
    }

    return response ?? NextResponse.next();
  } catch (error: unknown) {
    // Clerk's auth.protect() throws NEXT_REDIRECT intentionally to redirect to sign-in.
    // We must re-throw it so Next.js can handle the redirect properly.
    const isRedirect =
      error instanceof Error &&
      "digest" in error &&
      typeof (error as Error & { digest: string }).digest === "string" &&
      (error as Error & { digest: string }).digest.startsWith("NEXT_REDIRECT");

    if (isRedirect) {
      throw error;
    }

    // If Clerk throws entirely, still allow the page to render
    logger.error("[Middleware Error] Clerk middleware failed, continuing without auth:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
