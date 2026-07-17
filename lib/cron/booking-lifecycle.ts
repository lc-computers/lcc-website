import { and, eq, gt, isNull, lt, sql } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { bookings, bookingHolds } from "@/lib/db/schema";
import { loseRace, serviceForBooking } from "@/lib/booking/actions";
import {
  abandonedRecoveryEmail,
  bookingReminderEmail,
  reviewRequestEmail,
} from "@/lib/email/booking";
import { sendEmail } from "@/lib/email/send";
import { sendSms, toE164 } from "@/lib/sms";
import { site } from "@/lib/site";
import { formatDateTime, formatTime } from "@/lib/format";

/** Hourly booking lifecycle. Every step is independent and idempotent. */
export async function runBookingLifecycle(db: Db): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  const now = Date.now();
  const hours = (n: number) => new Date(now + n * 3600_000);

  // 1. Expired holds → release the slots.
  const expiredHolds = await db
    .delete(bookingHolds)
    .where(lt(bookingHolds.expiresAt, new Date(now)))
    .returning({ id: bookingHolds.id });
  counts.holds_expired = expiredHolds.length;

  // 2. Stale pending_payment bookings (>72h old). Unpaid ones are simply
  // canceled; any that carry a payment intent were PAID but never confirmed
  // (a webhook failure window) — those get the full refund + apology path,
  // never a silent cancel of money we're holding.
  const staleRows = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.status, "pending_payment"), lt(bookings.createdAt, hours(-72))))
    .limit(50);
  for (const booking of staleRows) {
    if (booking.stripePaymentIntentId) {
      try {
        await loseRace(db, booking);
        counts.stale_paid_refunded = (counts.stale_paid_refunded ?? 0) + 1;
      } catch (err) {
        console.error(`lifecycle: refund of stale paid booking ${booking.id} failed`, err);
      }
    } else {
      await db
        .update(bookings)
        .set({ status: "canceled", canceledAt: new Date(), updatedAt: new Date() })
        .where(eq(bookings.id, booking.id));
      counts.stale_pending_canceled = (counts.stale_pending_canceled ?? 0) + 1;
    }
  }

  // 3. Abandoned-checkout recovery — exactly ONE email, 3–48h after start.
  // (Window is wide enough that the daily Hobby-plan cron never skips past
  // anyone; the claim below guarantees at-most-once regardless of cadence.)
  const abandoned = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.status, "pending_payment"),
        lt(bookings.createdAt, hours(-3)),
        gt(bookings.createdAt, hours(-48)),
        isNull(bookings.recoveryEmailSentAt),
        // A payment intent means they PAID (webhook still settling) — that's
        // not an abandoned checkout, don't nudge them to book again.
        isNull(bookings.stripePaymentIntentId)
      )
    )
    .limit(25);
  for (const booking of abandoned) {
    // Claim first so a concurrent run can't double-send.
    const claimed = await db
      .update(bookings)
      .set({ recoveryEmailSentAt: new Date(), updatedAt: new Date() })
      .where(and(eq(bookings.id, booking.id), isNull(bookings.recoveryEmailSentAt)))
      .returning({ id: bookings.id });
    if (claimed.length === 0) continue;
    try {
      const email = abandonedRecoveryEmail(booking, serviceForBooking(booking));
      await sendEmail({ to: booking.email, subject: email.subject, html: email.html });
      counts.abandoned_recovery = (counts.abandoned_recovery ?? 0) + 1;
    } catch (err) {
      console.error(`lifecycle: recovery email failed for ${booking.id}`, err);
    }
  }

  // 4. Reminders (email + SMS) for confirmed bookings starting in the next
  // 36 hours. From the daily 6 AM CT cron, that catches every next-day slot
  // (8:00 AM = 26h out, 4:30 PM = 34.5h out) without ever firing two days
  // early; reminderSentAt keeps it to exactly one reminder per booking. On
  // Vercel Pro with an hourly cron, tighten this to gt(23)/lt(25) for
  // reminders that land almost exactly 24h ahead.
  const upcoming = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.status, "confirmed"),
        gt(bookings.startAt, hours(2)),
        lt(bookings.startAt, hours(36)),
        isNull(bookings.reminderSentAt)
      )
    )
    .limit(50);
  for (const booking of upcoming) {
    const claimed = await db
      .update(bookings)
      .set({ reminderSentAt: new Date(), updatedAt: new Date() })
      .where(and(eq(bookings.id, booking.id), isNull(bookings.reminderSentAt)))
      .returning({ id: bookings.id });
    if (claimed.length === 0) continue;
    try {
      const service = serviceForBooking(booking);
      const email = bookingReminderEmail(booking, service);
      await sendEmail({ to: booking.email, subject: email.subject, html: email.html });
      if (booking.smsConsent) {
        await sendSms(
          toE164(booking.phone),
          `${site.name} reminder: ${service.name} tomorrow, ${formatDateTime(booking.startAt)}. Reply or call ${site.phone.display} to reschedule — free. Reply STOP to opt out.`
        );
      }
      counts.reminders = (counts.reminders ?? 0) + 1;
    } catch (err) {
      console.error(`lifecycle: reminder failed for ${booking.id}`, err);
    }
  }

  // 5. Mark finished appointments completed.
  const completed = await db
    .update(bookings)
    .set({ status: "completed", completedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(bookings.status, "confirmed"), lt(bookings.endAt, new Date(now))))
    .returning({ id: bookings.id });
  counts.marked_completed = completed.length;

  // 6. Next-day review requests (email + SMS) — needs GOOGLE_REVIEW_URL.
  const reviewUrl = process.env.GOOGLE_REVIEW_URL;
  if (reviewUrl) {
    const finished = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.status, "completed"),
          lt(bookings.endAt, hours(-18)),
          gt(bookings.endAt, hours(-48)),
          isNull(bookings.reviewRequestSentAt)
        )
      )
      .limit(50);
    for (const booking of finished) {
      const claimed = await db
        .update(bookings)
        .set({ reviewRequestSentAt: new Date(), updatedAt: new Date() })
        .where(and(eq(bookings.id, booking.id), isNull(bookings.reviewRequestSentAt)))
        .returning({ id: bookings.id });
      if (claimed.length === 0) continue;
      try {
        const service = serviceForBooking(booking);
        const email = reviewRequestEmail(booking, service, reviewUrl);
        await sendEmail({ to: booking.email, subject: email.subject, html: email.html });
        if (booking.smsConsent) {
          await sendSms(
            toE164(booking.phone),
            `Thanks for having ${site.name} out! If we did right by you, a quick Google review means the world to a local shop: ${reviewUrl} Reply STOP to opt out.`
          );
        }
        counts.review_requests = (counts.review_requests ?? 0) + 1;
      } catch (err) {
        console.error(`lifecycle: review request failed for ${booking.id}`, err);
      }
    }
  } else {
    // TODO(Louis): set GOOGLE_REVIEW_URL (Google Business Profile → "Ask for
    // reviews" link) to activate the post-appointment review flywheel.
    counts.review_requests_skipped_no_url = 1;
  }

  // 7. Rate-limit table housekeeping (rows older than 2 days).
  await db.execute(sql`DELETE FROM rate_limits WHERE window_start < now() - interval '2 days'`);

  return counts;
}
