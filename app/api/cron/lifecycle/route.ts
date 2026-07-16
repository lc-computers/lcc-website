import { NextResponse } from "next/server";
import { getDb, hasDb } from "@/lib/db";
import { runBookingLifecycle } from "@/lib/cron/booking-lifecycle";
import { runNurtureQueue } from "@/lib/cron/nurture";
import { closeStaleChatSessions } from "@/lib/cron/chat-closeout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Hourly lifecycle cron (vercel.json). Vercel sends
 * "Authorization: Bearer $CRON_SECRET" automatically when the env var is set.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasDb()) {
    return NextResponse.json({ ok: false, reason: "no database configured" });
  }
  const db = getDb();
  const results: Record<string, unknown> = {};

  try {
    results.booking = await runBookingLifecycle(db);
  } catch (err) {
    console.error("cron: booking lifecycle failed", err);
    results.booking = { error: String(err) };
  }
  try {
    results.nurture = await runNurtureQueue(db);
  } catch (err) {
    console.error("cron: nurture failed", err);
    results.nurture = { error: String(err) };
  }
  try {
    results.chat = await closeStaleChatSessions(db);
  } catch (err) {
    console.error("cron: chat closeout failed", err);
    results.chat = { error: String(err) };
  }

  return NextResponse.json({ ok: true, results });
}
