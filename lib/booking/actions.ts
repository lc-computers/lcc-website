import { eq } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { bookings, bookingHolds } from "@/lib/db/schema";
import { getResidentialService, site, type ResidentialService } from "@/lib/site";
import { sendEmail } from "@/lib/email/send";
import {
  bookingConfirmationEmail,
  bookingCanceledEmail,
  raceApologyEmail,
  type BookingRow,
} from "@/lib/email/booking";
import { notifyLead } from "@/lib/email/internal";
import { sendSms, toE164 } from "@/lib/sms";
import { buildIcs, icsAttachment } from "@/lib/ics";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  updateCalendarEvent,
} from "@/lib/graph";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { trackServer } from "@/lib/analytics/server";
import { formatDateTime, formatMoney, formatTime } from "@/lib/format";

export function serviceForBooking(booking: BookingRow): ResidentialService {
  const service = getResidentialService(booking.serviceSlug);
  if (!service) throw new Error(`Unknown service slug on booking ${booking.id}`);
  return service;
}

function bookingAddress(booking: BookingRow): string | undefined {
  if (!booking.street) return undefined;
  return `${booking.street}, ${booking.city}, KY ${booking.zip}`;
}

function confirmationIcs(booking: BookingRow, service: ResidentialService) {
  return icsAttachment(
    buildIcs({
      uid: booking.id,
      start: booking.startAt,
      end: booking.endAt,
      summary: `${service.name} — ${site.name}`,
      description:
        service.kind === "remote"
          ? `A ${site.name} technician calls you at ${booking.phone} and connects via a secure screen-share link. Questions: ${site.phone.display}`
          : `${service.name} at your home. Manage: ${site.url}/book/manage/${booking.manageToken} · Questions: ${site.phone.display}`,
      location:
        service.kind === "remote" ? "Phone + secure screen share" : bookingAddress(booking),
    })
  );
}

/**
 * All confirmation side effects (Graph event, emails, SMS, internal notify,
 * conversion event). Runs after the booking row is marked confirmed. Each
 * effect is independent — one failing never blocks the others.
 */
export async function runConfirmationEffects(
  db: Db,
  booking: BookingRow,
  opts?: { rescheduled?: boolean }
): Promise<void> {
  const service = serviceForBooking(booking);

  // Shared "Service Appointments" calendar
  try {
    if (opts?.rescheduled && booking.graphEventId) {
      await updateCalendarEvent(booking.graphEventId, booking.startAt, booking.blockEndAt);
    } else if (!booking.graphEventId) {
      const eventId = await createCalendarEvent({
        customerName: booking.customerName,
        serviceName: service.name,
        phone: booking.phone,
        address: bookingAddress(booking),
        start: booking.startAt,
        end: booking.blockEndAt,
        bookingId: booking.id,
      });
      if (eventId) {
        await db.update(bookings).set({ graphEventId: eventId }).where(eq(bookings.id, booking.id));
        booking = { ...booking, graphEventId: eventId };
      }
    }
  } catch (err) {
    console.error("booking: graph event failed (continuing)", err);
  }

  // Customer email + ICS
  const email = bookingConfirmationEmail(booking, service, opts);
  await sendEmail({
    to: booking.email,
    subject: email.subject,
    html: email.html,
    attachments: [confirmationIcs(booking, service)],
  });

  // Customer SMS (only with consent)
  if (booking.smsConsent) {
    const when = `${formatDateTime(booking.startAt)}`;
    const body =
      service.kind === "remote"
        ? `${site.name}: you're booked! ${service.name} on ${when}. We'll call you at your appointment time. Manage: ${site.url}/book/manage/${booking.manageToken} Reply STOP to opt out.`
        : `${site.name}: you're booked! ${service.name} on ${when}. Manage: ${site.url}/book/manage/${booking.manageToken} Reply STOP to opt out.`;
    await sendSms(toE164(booking.phone), body);
  }

  // Internal notification
  await notifyLead({
    source: "Booking",
    subject: `${opts?.rescheduled ? "Rescheduled" : "New paid booking"}: ${service.name} — ${formatDateTime(booking.startAt)}`,
    fields: {
      Service: `${service.name} (${formatMoney(booking.totalCents)})`,
      When: `${formatDateTime(booking.startAt)} – ${formatTime(booking.endAt)}`,
      Customer: booking.customerName,
      Phone: booking.phone,
      Email: booking.email,
      Address: bookingAddress(booking) ?? "Remote session",
      "Travel fee": booking.travelFeeCents > 0 ? formatMoney(booking.travelFeeCents) : "None",
      "SMS consent": booking.smsConsent ? "Yes" : "No",
    },
  });

  if (!opts?.rescheduled) {
    await trackServer("booking_paid", {
      service: booking.serviceSlug,
      total_cents: booking.totalCents,
    });
  }
}

/** Refund a booking's payment in full. Returns true when a refund was issued. */
export async function refundBookingPayment(booking: BookingRow): Promise<boolean> {
  if (!booking.stripePaymentIntentId) {
    console.error(`booking ${booking.id}: no payment intent to refund`);
    return false;
  }
  if (!isStripeConfigured()) {
    console.log(`[stripe:log-mode] refund payment_intent=${booking.stripePaymentIntentId}`);
    return true;
  }
  try {
    await getStripe().refunds.create({ payment_intent: booking.stripePaymentIntentId });
    return true;
  } catch (err) {
    console.error(`booking ${booking.id}: refund failed`, err);
    return false;
  }
}

/** Race-loss path: refund, mark refunded, apologize. */
export async function loseRace(db: Db, booking: BookingRow): Promise<void> {
  const service = serviceForBooking(booking);
  const refunded = await refundBookingPayment(booking);
  await db
    .update(bookings)
    .set({
      status: "refunded",
      canceledAt: new Date(),
      refundedAt: refunded ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, booking.id));
  await db.delete(bookingHolds).where(eq(bookingHolds.bookingId, booking.id));
  const email = raceApologyEmail(booking, service);
  await sendEmail({ to: booking.email, subject: email.subject, html: email.html });
  await notifyLead({
    source: "Booking",
    subject: `Race-loss auto-refund: ${service.name} — ${booking.customerName}`,
    fields: {
      Customer: booking.customerName,
      Email: booking.email,
      Phone: booking.phone,
      "Wanted slot": formatDateTime(booking.startAt),
      Refunded: refunded ? "Yes, automatically" : "REFUND FAILED — issue manually in Stripe",
    },
  });
}

/** Customer-initiated cancel (≥24h) — auto-refund via Stripe. */
export async function cancelBookingWithRefund(db: Db, booking: BookingRow): Promise<boolean> {
  const service = serviceForBooking(booking);
  const refunded = await refundBookingPayment(booking);
  await db
    .update(bookings)
    .set({
      status: refunded ? "refunded" : "canceled",
      canceledAt: new Date(),
      refundedAt: refunded ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, booking.id));
  await db.delete(bookingHolds).where(eq(bookingHolds.bookingId, booking.id));
  if (booking.graphEventId) {
    await deleteCalendarEvent(booking.graphEventId);
  }
  const email = bookingCanceledEmail(booking, service, refunded);
  await sendEmail({ to: booking.email, subject: email.subject, html: email.html });
  await notifyLead({
    source: "Booking",
    subject: `Canceled: ${service.name} — ${booking.customerName} (${formatDateTime(booking.startAt)})`,
    fields: {
      Customer: booking.customerName,
      Phone: booking.phone,
      Slot: formatDateTime(booking.startAt),
      Refund: refunded ? `Issued automatically (${formatMoney(booking.totalCents)})` : "FAILED — issue manually in Stripe",
    },
  });
  return refunded;
}
