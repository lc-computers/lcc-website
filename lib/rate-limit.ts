import { sql } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { rateLimits } from "@/lib/db/schema";

/**
 * Fixed-window rate limiter. DB-backed when a database is configured (works
 * across serverless instances); in-memory best-effort fallback otherwise.
 */

const memory = new Map<string, { count: number; windowStart: number }>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
}

export async function rateLimit(opts: {
  name: string;
  identifier: string;
  limit: number;
  windowSeconds: number;
}): Promise<RateLimitResult> {
  const windowMs = opts.windowSeconds * 1000;
  const bucket = Math.floor(Date.now() / windowMs);
  const key = `${opts.name}:${opts.identifier}:${bucket}`;

  if (hasDb()) {
    try {
      const db = getDb();
      const rows = await db
        .insert(rateLimits)
        .values({ key, count: 1 })
        .onConflictDoUpdate({
          target: rateLimits.key,
          set: { count: sql`${rateLimits.count} + 1` },
        })
        .returning({ count: rateLimits.count });
      const count = rows[0]?.count ?? 1;
      return { ok: count <= opts.limit, remaining: Math.max(0, opts.limit - count) };
    } catch (err) {
      console.error("rate-limit: db error, falling back to memory", err);
    }
  }

  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || now - entry.windowStart > windowMs) {
    memory.set(key, { count: 1, windowStart: now });
    // opportunistic cleanup
    if (memory.size > 5000) {
      for (const [k, v] of memory) {
        if (now - v.windowStart > windowMs) memory.delete(k);
      }
    }
    return { ok: opts.limit >= 1, remaining: opts.limit - 1 };
  }
  entry.count += 1;
  return { ok: entry.count <= opts.limit, remaining: Math.max(0, opts.limit - entry.count) };
}

/** Client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}
