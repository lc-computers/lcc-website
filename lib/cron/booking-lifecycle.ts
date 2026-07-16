import { and, eq, gt, isNull, lt, sql } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { bookings, bookingHolds } from "@/lib/db/schema";
import { serviceForBooking } from "@/lib/booking/actions";
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

  // 2. Stale pending_payment bookings (>24h old) → canceled.
  const stale = await db
    .update(bookings)
    .set({ status: "canceled", canceledAt: new Date(), updatedAt: new Date() })
    .where(and(eq(bookings.status, "pending_payment"), lt(bookings.createdAt, hours(-24))))
    .returning({ id: bookings.id });
  counts.stale_pending_canceled = stale.length;

  // 3. Abandoned-checkout recovery — exactly ONE email, 3–24h after start.
  const abandoned = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.status, "pending_payment"),
        lt(bookings.createdAt, hours(-3)),
        gt(bookings.createdAt, hours(-24)),
        isNull(bookings.recoveryEmailSentAt)
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

  // 4. 24-hour reminders (email + SMS) for confirmed bookings.
  const upcoming = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.status, "confirmed"),
        gt(bookings.startAt, hours(23)),
        lt(bookings.startAt, hours(25)),
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
