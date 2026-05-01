import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { loginAttempts } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

const ADMIN_COOKIE_NAME = "admin_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 1000; // 1 minute

// NEW-L6: Removed hardcoded fallback secret — throw if no secret is configured
function getHmacSecret(): string {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_SECRET or ADMIN_PASSWORD must be configured");
  }
  return secret;
}

async function createToken(password: string): Promise<string> {
  const secret = getHmacSecret();
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(password));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyToken(token: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  try {
    const secret = getHmacSecret();
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(adminPassword));
    const expectedHmac = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return timingSafeEqual(token, expectedHmac);
  } catch {
    return false;
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remainingMs: number }> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + WINDOW_MS);

  const [record] = await db
    .select()
    .from(loginAttempts)
    .where(eq(loginAttempts.ip, ip))
    .limit(1);

  if (!record || record.expiresAt < now) {
    // Reset or create new record
    await db
      .insert(loginAttempts)
      .values({ ip, count: 1, lastAttempt: now, expiresAt })
      .onConflictDoUpdate({
        target: loginAttempts.ip,
        set: { count: 1, lastAttempt: now, expiresAt },
      });
    return { allowed: true, remainingMs: 0 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const remainingMs = record.expiresAt.getTime() - now.getTime();
    return { allowed: false, remainingMs: Math.max(0, remainingMs) };
  }

  await db
    .update(loginAttempts)
    .set({
      count: sql`${loginAttempts.count} + 1`,
      lastAttempt: now,
    })
    .where(eq(loginAttempts.ip, ip));

  return { allowed: true, remainingMs: 0 };
}

export async function loginAdmin(password: string): Promise<{ success: boolean; error?: string }> {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { success: false, error: "Admin password not configured" };
  }

  if (password !== adminPassword) {
    return { success: false, error: "Invalid password" };
  }

  const token = await createToken(password);

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return { success: true };
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) return false;

  return verifyToken(token);
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  return verifyToken(token);
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
