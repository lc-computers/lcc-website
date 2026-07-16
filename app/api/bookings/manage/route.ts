import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb, hasDb, type Db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { isSlotAvailable, withSlotLock } from "@/lib/booking/availability";
import {
  cancelBookingWithRefund,
  runConfirmationEffects,
  serviceForBooking,
} from "@/lib/booking/actions";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("cancel"),
    token: z.string().min(10).max(100),
  }),
  z.object({
    action: z.literal("reschedule"),
    token: z.string().min(10).max(100),
    start: z.iso.datetime(),
  }),
]);

const CANCEL_CUTOFF_MS = 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  const limit = await rateLimit({
    name: "manage",
    identifier: clientIp(req),
    limit: 20,
    windowSeconds: 3600,
  });
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  if (!hasDb()) {
    return NextResponse.json(
      { error: `Please call us at ${site.phone.display} to change this booking.` },
      { status: 503 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const input = parsed.data;
  const db = getDb();

  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.manageToken, input.token));
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (booking.status !== "confirmed") {
    return NextResponse.json(
      { error: "This booking can no longer be changed online.", code: "not_changeable" },
      { status: 409 }
    );
  }

  if (input.action === "cancel") {
    const msUntil = booking.startAt.getTime() - Date.now();
    if (msUntil < CANCEL_CUTOFF_MS) {
      return NextResponse.json(
        {
          error: `Appointments within 24 hours can't be canceled online — call us at ${site.phone.display} and we'll work it out.`,
          code: "inside_24h",
        },
        { status: 409 }
      );
    }
    const refunded = await cancelBookingWithRefund(db, booking);
    return NextResponse.json({ ok: true, refunded });
  }

  // Reschedule — free anytime, new slot must be genuinely available.
  const service = serviceForBooking(booking);
  const newStart = new Date(input.start);

  const result = await db.transaction(async (tx) => {
    return withSlotLock(tx, newStart, async () => {
      const check = await isSlotAvailable(tx as unknown as Db, service, newStart, {
        excludeBookingId: booking.id,
      });
      if (!check.ok || !check.slot) {
        return { ok: false as const };
      }
      await tx
        .update(bookings)
        .set({
          startAt: check.slot.start,
          endAt: check.slot.end,
          blockEndAt: check.slot.blockEnd,
          reminderSentAt: null, // re-arm the 24h reminder for the new time
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, booking.id));
      return { ok: true as const };
    });
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: "That time was just taken — pick another slot.", code: "slot_unavailable" },
      { status: 409 }
    );
  }

  const [updated] = await db.select().from(bookings).where(eq(bookings.id, booking.id));
  if (updated) {
    await runConfirmationEffects(db, updated, { rescheduled: true });
  }
  return NextResponse.json({ ok: true });
}
