import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "admin_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// In-memory rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 1000; // 1 minute

function getHmacSecret(): string {
  // Use ADMIN_SECRET if available, otherwise derive from ADMIN_PASSWORD
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "fallback-secret-change-me";
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
  const hmacHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  // Prepend a random nonce for additional entropy
  const nonceArray = new Uint8Array(16);
  crypto.getRandomValues(nonceArray);
  const nonce = Array.from(nonceArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${nonce}:${hmacHex}`;
}

async function verifyToken(token: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  try {
    const parts = token.split(":");
    if (parts.length !== 2) return false;

    const [, providedHmac] = parts;
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

    // Constant-time comparison to prevent timing attacks
    return timingSafeEqual(providedHmac, expectedHmac);
  } catch {
    return false;
  }
}

// Constant-time string comparison
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export function checkRateLimit(ip: string): { allowed: boolean; remainingMs: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now - record.lastAttempt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return { allowed: true, remainingMs: 0 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const remainingMs = WINDOW_MS - (now - record.lastAttempt);
    return { allowed: false, remainingMs };
  }

  record.count++;
  record.lastAttempt = now;
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

  // Create HMAC-based token (password is NOT stored in the cookie)
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
