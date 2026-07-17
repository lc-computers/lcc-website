import { randomBytes, createHmac, timingSafeEqual } from "node:crypto";

/** URL-safe random token (default 32 bytes → 43 chars). */
export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

function secret(): string | null {
  // No fallback: a well-known default would make email tokens forgeable.
  return process.env.ADMIN_SECRET || null;
}

/**
 * Stateless signed token for unsubscribe links: base64url(email).sig
 * Returns null when ADMIN_SECRET is unset — callers fall back to a mailto:
 * unsubscribe address rather than emitting a forgeable link.
 */
export function signEmailToken(email: string): string | null {
  const key = secret();
  if (!key) return null;
  const payload = Buffer.from(email.toLowerCase()).toString("base64url");
  const sig = createHmac("sha256", key).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

/** Returns the email if the token is valid, else null. */
export function verifyEmailToken(token: string): string | null {
  const key = secret();
  if (!key) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", key).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return Buffer.from(payload, "base64url").toString("utf8");
  } catch {
    return null;
  }
}
