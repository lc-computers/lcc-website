import { emailLayout, emailButton, emailHeading, emailPanel, escapeHtml } from "./layout";
import { formatDateTime, formatMoney, formatTime } from "@/lib/format";
import { site, type ResidentialService } from "@/lib/site";
import type { bookings } from "@/lib/db/schema";

export type BookingRow = typeof bookings.$inferSelect;

function manageUrl(booking: BookingRow): string {
  return `${site.url}/book/manage/${booking.manageToken}`;
}

function detailsPanel(booking: BookingRow, service: ResidentialService): string {
  const rows: string[] = [
    `<strong>${escapeHtml(service.name)}</strong> — ${formatMoney(booking.totalCents)}${
      booking.travelFeeCents > 0
        ? ` <span style="color:#4C5D76;">(includes ${formatMoney(booking.travelFeeCents)} travel fee)</span>`
        : ""
    }`,
    `<strong>When:</strong> ${formatDateTime(booking.startAt)} – ${formatTime(booking.endAt)}`,
  ];
  if (service.kind === "in_home") {
    rows.push(
      `<strong>Where:</strong> ${escapeHtml(booking.street ?? "")}, ${escapeHtml(booking.city ?? "")}, KY ${escapeHtml(booking.zip ?? "")}`
    );
  } else {
    rows.push(`<strong>How:</strong> We call you at ${escapeHtml(booking.phone)} at your appointment time.`);
  }
  return emailPanel(rows.join("<br>"));
}

function whatToExpect(service: ResidentialService): string {
  if (service.kind === "remote") {
    return `<p><strong>How your remote session works:</strong> at your appointment time, one of our technicians calls you at the number you gave us. They'll walk you through opening a secure, one-time screen-share link — you approve it on your end and can watch everything they do. When the session ends, the connection is gone for good. Have your computer on and connected to the internet when we call.</p>`;
  }
  return `<p><strong>What to expect:</strong> a technician from our Russell Springs shop arrives at your confirmed time — the actual time, not a window. Please have the computer or equipment reachable, and know any passwords you use (we never need to keep them). If anything changes on our end, we call you first.</p>`;
}

function policyLine(booking: BookingRow): string {
  return `<p style="font-size:13px;color:#4C5D76;">${site.cancellation.policy} Use <a href="${manageUrl(
    booking
  )}" style="color:#0C447C;">your booking page</a> to cancel or reschedule, or call ${site.phone.display}.</p>`;
}

export function bookingConfirmationEmail(
  booking: BookingRow,
  service: ResidentialService,
  opts?: { rescheduled?: boolean }
): { subject: string; html: string } {
  const subject = opts?.rescheduled
    ? `Rescheduled: ${service.name} — ${formatDateTime(booking.startAt)}`
    : `You're booked: ${service.name} — ${formatDateTime(booking.startAt)}`;
  const html = emailLayout({
    preheader: `Confirmed for ${formatDateTime(booking.startAt)}. ${site.cancellation.policy}`,
    bodyHtml: `
${emailHeading(opts?.rescheduled ? "Your new time is confirmed." : `You're booked, ${escapeHtml(booking.customerName.split(" ")[0] ?? booking.customerName)}.`)}
<p>${
      opts?.rescheduled
        ? "Here are your updated appointment details:"
        : "Payment received, appointment locked in. Here's everything:"
    }</p>
${detailsPanel(booking, service)}
${whatToExpect(service)}
<p>A calendar invite is attached — one tap adds it to your phone or computer calendar.</p>
${emailButton(manageUrl(booking), "Manage this booking")}
${policyLine(booking)}
<p>Questions before then? Call ${site.phone.display} — a person answers, ${site.hours.short}.</p>`,
  });
  return { subject, html };
}

export function bookingReminderEmail(
  booking: BookingRow,
  service: ResidentialService
): { subject: string; html: string } {
  const html = emailLayout({
    preheader: `Tomorrow: ${service.name} at ${formatTime(booking.startAt)} CT.`,
    bodyHtml: `
${emailHeading("See you tomorrow.")}
<p>A quick reminder about your appointment:</p>
${detailsPanel(booking, service)}
${whatToExpect(service)}
<p><strong>Need to change it?</strong> Rescheduling is free anytime — reply to this email, call ${site.phone.display}, or use the button below.</p>
${emailButton(manageUrl(booking), "Reschedule or cancel")}
`,
  });
  return { subject: `Reminder: ${service.name} tomorrow at ${formatTime(booking.startAt)} CT`, html };
}

export function bookingCanceledEmail(
  booking: BookingRow,
  service: ResidentialService,
  refunded: boolean
): { subject: string; html: string } {
  const html = emailLayout({
    preheader: refunded ? "Your refund is on its way." : "Your booking is canceled.",
    bodyHtml: `
${emailHeading("Booking canceled.")}
<p>Your ${escapeHtml(service.name)} appointment for ${formatDateTime(booking.startAt)} is canceled.</p>
${
      refunded
        ? `<p><strong>Your ${formatMoney(booking.totalCents)} refund has been issued</strong> to your original payment method. Depending on your bank, it can take 5–10 business days to appear.</p>`
        : ""
    }
<p>Whenever you need us again, booking takes about two minutes:</p>
${emailButton(`${site.url}/book`, "Book a new appointment")}
<p>Or call ${site.phone.display} — we're glad to help by phone too.</p>`,
  });
  return { subject: `Canceled: ${service.name} on ${formatDateTime(booking.startAt)}`, html };
}

export function raceApologyEmail(
  booking: BookingRow,
  service: ResidentialService
): { subject: string; html: string } {
  const html = emailLayout({
    preheader: "Your payment has been fully refunded — and we'd like to make this right.",
    bodyHtml: `
${emailHeading("We owe you an apology.")}
<p>Two people booked the same ${escapeHtml(service.name)} slot within moments of each other, and the other booking finished payment first. That's our least favorite kind of coincidence, and we're sorry.</p>
<p><strong>Your ${formatMoney(booking.totalCents)} payment has already been refunded in full</strong> — nothing to do on your end. Depending on your bank it may take a few business days to appear.</p>
<p>The calendar shows live availability, so the time you pick next will be yours:</p>
${emailButton(`${site.url}/book?service=${service.slug}`, "Pick a new time")}
<p>Or call ${site.phone.display} and we'll find you the next best slot ourselves — mention this email.</p>`,
  });
  return { subject: `Our apology — that time slot was just taken (full refund issued)`, html };
}

export function abandonedRecoveryEmail(
  booking: BookingRow,
  service: ResidentialService
): { subject: string; html: string } {
  const firstName = escapeHtml(booking.customerName.split(" ")[0] ?? booking.customerName);
  const html = emailLayout({
    preheader: "Your appointment details are saved — finishing takes about a minute.",
    bodyHtml: `
${emailHeading(`Still need help with that, ${firstName}?`)}
<p>You started booking a <strong>${escapeHtml(service.name)}</strong> (${formatMoney(
      booking.totalCents
    )}) but didn't finish checkout. No problem — it happens.</p>
<p>Your slot may still be open. Picking up where you left off takes about a minute:</p>
${emailButton(`${site.url}/book?service=${service.slug}`, "Finish booking")}
<p>Rather talk it through first? Call ${site.phone.display} — a person answers, ${site.hours.short}.</p>
<p style="font-size:13px;color:#4C5D76;">This is the only nudge we'll send — promise.</p>`,
  });
  return { subject: `Still need help with that ${service.name.toLowerCase()}? Your slot may still be open`, html };
}

export function reviewRequestEmail(
  booking: BookingRow,
  service: ResidentialService,
  reviewUrl: string
): { subject: string; html: string } {
  const firstName = escapeHtml(booking.customerName.split(" ")[0] ?? booking.customerName);
  const html = emailLayout({
    preheader: "One minute of your time would mean a lot to a local shop.",
    bodyHtml: `
${emailHeading(`Thanks for having us out, ${firstName}.`)}
<p>Hope everything from your ${escapeHtml(service.name)} is still running the way it should. If anything isn't right, call ${site.phone.display} first — we'll fix it.</p>
<p>If you were happy with the visit, would you take one minute to say so in a Google review? For a small local shop, those reviews are how the next neighbor finds us.</p>
${emailButton(reviewUrl, "Leave a quick review")}
<p>Either way — thank you for trusting us with it.</p>
<p>— Louis and the team at ${site.name}</p>`,
  });
  return { subject: "How did we do? (one-minute favor)", html };
}
