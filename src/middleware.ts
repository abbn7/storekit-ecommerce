import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
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

export default clerkMiddleware(async (auth, req) => {
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
    const isValid = await verifyAdminToken(adminToken);
    if (!isValid) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
