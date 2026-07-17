import { NextResponse } from "next/server";
import { getDb, hasDb } from "@/lib/db";
import { runBookingLifecycle } from "@/lib/cron/booking-lifecycle";
import { runNurtureQueue } from "@/lib/cron/nurture";
import { closeStaleChatSessions } from "@/lib/cron/chat-closeout";
import { chicagoDateOf } from "@/lib/time";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Lifecycle cron (vercel.json). Vercel sends
 * "Authorization: Bearer $CRON_SECRET" automatically when the env var is set.
 *
 * Scheduled DAILY (Hobby plan allows daily crons only) at 11:00 UTC / 6 AM CT;
 * on Mondays it also drafts the weekly article, and on the 1st it drafts the
 * monthly newsletter. On Vercel Pro you can run this hourly and re-add the
 * dedicated /api/cron/weekly-draft and /api/cron/monthly-newsletter schedules
 * instead — the routes are all idempotent (see README).
 */
export async function GET(req: Request) {
  // Fail closed: without CRON_SECRET this endpoint stays off entirely.
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
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

  // Daily-cron consolidation (Hobby plan): weekly draft on Mondays,
  // newsletter draft on the 1st — both in Chicago time.
  const today = chicagoDateOf(new Date());
  const origin = new URL(req.url).origin;
  const auth = req.headers.get("authorization");
  const forward = async (path: string): Promise<unknown> => {
    const res = await fetch(`${origin}${path}`, {
      headers: auth ? { authorization: auth } : undefined,
    });
    return res.json().catch(() => ({ status: res.status }));
  };
  if (today.weekday === 1) {
    try {
      results.weeklyDraft = await forward("/api/cron/weekly-draft");
    } catch (err) {
      console.error("cron: weekly draft failed", err);
      results.weeklyDraft = { error: String(err) };
    }
  }
  if (today.day === 1) {
    try {
      results.monthlyNewsletter = await forward("/api/cron/monthly-newsletter");
    } catch (err) {
      console.error("cron: monthly newsletter failed", err);
      results.monthlyNewsletter = { error: String(err) };
    }
  }

  return NextResponse.json({ ok: true, results });
}
