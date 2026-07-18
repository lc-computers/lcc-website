import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getDb, hasDb, type Db } from "@/lib/db";
import { bookings, bookingHolds, stripeEvents } from "@/lib/db/schema";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { isSlotAvailable, withSlotLock } from "@/lib/booking/availability";
import {
  loseRace,
  runConfirmationEffects,
  serviceForBooking,
} from "@/lib/booking/actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook: signature-verified, idempotent (stripe_events table).
 * checkout.session.completed → double-check capacity, then confirm (or
 * auto-refund + apologize if the slot was lost in a race).
 * checkout.session.expired → release the hold; abandoned-recovery cron
 * handles the single follow-up email.
 */
export async function POST(req: Request) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }
  if (!hasDb()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const payload = await req.text();
    event = getStripe().webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("webhook: signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = getDb();

  // Idempotency: first insert wins; replays ack immediately.
  const inserted = await db
    .insert(stripeEvents)
    .values({ id: event.id, type: event.type })
    .onConflictDoNothing()
    .returning({ id: stripeEvents.id });
  if (inserted.length === 0) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCompleted(db, event.data.object);
        break;
      }
      case "checkout.session.expired": {
        await handleExpired(db, event.data.object);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    // Release the idempotency row and ask Stripe to retry — a transient
    // failure here must never strand a paid booking. Sequential retries are
    // safe: handleCompleted re-checks booking status before acting.
    console.error(`webhook: handler for ${event.type} failed`, err);
    try {
      await db.delete(stripeEvents).where(eq(stripeEvents.id, event.id));
    } catch (cleanupErr) {
      console.error("webhook: failed to release idempotency row", cleanupErr);
    }
    return NextResponse.json({ error: "Handler failed — retry" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCompleted(db: Db, session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) {
    console.error("webhook: completed session missing bookingId metadata", session.id);
    return;
  }
  const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId));
  if (!booking) {
    console.error("webhook: booking not found", bookingId);
    return;
  }
  if (booking.status === "confirmed" || booking.status === "completed") {
    return; // already handled
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  // Persist the payment reference first — refunds depend on it.
  await db
    .update(bookings)
    .set({ stripePaymentIntentId: paymentIntentId, updatedAt: new Date() })
    .where(eq(bookings.id, booking.id));
  booking.stripePaymentIntentId = paymentIntentId;

  const service = await serviceForBooking(booking);

  // Final capacity check under the same per-day lock used at checkout.
  const won = await db.transaction(async (tx) => {
    return withSlotLock(tx, booking.startAt, async () => {
      const check = await isSlotAvailable(tx as unknown as Db, service, booking.startAt, {
        excludeBookingId: booking.id,
        skipLeadCheck: true,
      });
      if (!check.ok) return false;
      await tx
        .update(bookings)
        .set({ status: "confirmed", confirmedAt: new Date(), updatedAt: new Date() })
        .where(eq(bookings.id, booking.id));
      await tx.delete(bookingHolds).where(eq(bookingHolds.bookingId, booking.id));
      return true;
    });
  });

  if (!won) {
    await loseRace(db, booking);
    return;
  }

  const [confirmed] = await db.select().from(bookings).where(eq(bookings.id, booking.id));
  if (confirmed) {
    await runConfirmationEffects(db, confirmed);
  }
}

async function handleExpired(db: Db, session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) return;
  await db.delete(bookingHolds).where(eq(bookingHolds.bookingId, bookingId));
  // Booking stays pending_payment: the lifecycle cron sends the single
  // abandoned-recovery email and later cancels stale pendings.
}
