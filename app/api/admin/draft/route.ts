import { NextResponse } from "next/server";
import { getDb, hasDb } from "@/lib/db";
import { draftNextArticle } from "@/lib/content-engine";
import { isAdmin, hasAdminBearer } from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * POST /api/admin/draft — drafts the next queued topic.
 * Auth: admin cookie (from /admin) or "Authorization: Bearer <ADMIN_SECRET>".
 */
export async function POST(req: Request) {
  if (!(await isAdmin()) && !hasAdminBearer(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasDb()) {
    return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 503 });
  }
  const result = await draftNextArticle(getDb());
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 500 });
  }
  return NextResponse.json({ ok: true, postId: result.postId, title: result.title });
}
