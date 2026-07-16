import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Simple ADMIN_SECRET cookie gate for /admin and admin APIs.
 * The cookie stores an HMAC-signed token (never the secret itself).
 */

const COOKIE_NAME = "lcc_admin";

function adminToken(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return "";
  return createHmac("sha256", secret).update("lcc-admin-v1").digest("base64url");
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_SECRET);
}

export async function isAdmin(): Promise<boolean> {
  if (!isAdminConfigured()) return false;
  const jar = await cookies();
  const value = jar.get(COOKIE_NAME)?.value;
  if (!value) return false;
  const expected = adminToken();
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function grantAdminCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, adminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function revokeAdminCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/** Header-based check for API/cron callers: Authorization: Bearer <ADMIN_SECRET>. */
export function hasAdminBearer(req: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}
