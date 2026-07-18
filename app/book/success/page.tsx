import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { CheckCircle2, Clock3 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { getDb, hasDb } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { site } from "@/lib/site";
import { findService } from "@/lib/booking/services";
import { formatDateTime, formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

async function loadBooking(sessionId: string) {
  if (!hasDb()) return null;
  const db = getDb();
  // The Stripe webhook usually lands within a second or two of redirect —
  // wait briefly so most customers see the fully confirmed state.
  for (let attempt = 0; attempt < 4; attempt++) {
    const [row] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.stripeSessionId, sessionId));
    if (row?.status === "confirmed") return row;
    if (attempt < 3) await new Promise((r) => setTimeout(r, 1200));
  }
  const [row] = await db.select().from(bookings).where(eq(bookings.stripeSessionId, sessionId));
  return row ?? null;
}

/** Free bookings confirm synchronously — no Stripe session, just the manage token. */
async function loadBookingByToken(token: string) {
  if (!hasDb()) return null;
  const db = getDb();
  const [row] = await db.select().from(bookings).where(eq(bookings.manageToken, token));
  return row ?? null;
}

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; bt?: string }>;
}) {
  const { session_id: sessionId, bt } = await searchParams;
  const booking = bt
    ? await loadBookingByToken(bt)
    : sessionId
      ? await loadBooking(sessionId)
      : null;
  const service = booking
    ? await findService(booking.serviceSlug, { includeInactive: true })
    : null;
  const confirmed = booking?.status === "confirmed";
  const lostRace = booking?.status === "refunded" || booking?.status === "canceled";

  if (booking && service && lostRace) {
    return (
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-xl rounded-lg border border-cream-200 bg-white p-8 text-center shadow-card sm:p-10">
            <Clock3 className="mx-auto h-12 w-12 text-brass-500" aria-hidden="true" />
            <h1 className="mt-5 font-serif text-3xl font-semibold text-ink-900">
              That slot was taken moments before you paid.
            </h1>
            <p className="mt-4 text-base text-ink-700">
              We&apos;re sorry — two people booked the same time almost simultaneously, and the
              other payment finished first. <strong>Your {formatMoney(booking.totalCents)} has
              been refunded in full</strong> (details in your email; allow a few business days
              for your bank).
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <ButtonLink href={`/book?service=${service.slug}`}>Pick a new time</ButtonLink>
              <p className="text-sm text-ink-500">
                Or call{" "}
                <PhoneLink location="book_success_race" className="font-bold text-navy-700" /> and
                we&apos;ll find you the next best slot ourselves.
              </p>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-xl rounded-lg border border-cream-200 bg-white p-8 text-center shadow-card sm:p-10">
          {confirmed ? (
            <CheckCircle2 className="mx-auto h-12 w-12 text-navy-600" aria-hidden="true" />
          ) : (
            <Clock3 className="mx-auto h-12 w-12 text-brass-500" aria-hidden="true" />
          )}
          <h1 className="mt-5 font-serif text-3xl font-semibold text-ink-900">
            {confirmed ? "You're booked." : "Payment received."}
          </h1>
          {booking && service ? (
            <>
              <p className="mt-3 text-lg text-ink-700">
                {service.name} — <strong>{formatDateTime(booking.startAt)}</strong>
              </p>
              <p className="mt-2 text-sm text-ink-500">
                {booking.totalCents === 0
                  ? "No charge — this appointment is free."
                  : `${formatMoney(booking.totalCents)} paid${
                      booking.travelFeeCents > 0
                        ? ` (includes ${formatMoney(booking.travelFeeCents)} travel fee)`
                        : ""
                    }.`}
              </p>
              {confirmed ? (
                <p className="mt-4 text-base text-ink-700">
                  Your confirmation email is on its way with a calendar invite
                  {booking.smsConsent ? " — and a text is headed to your phone" : ""}. Need to
                  change anything?{" "}
                  <Link
                    href={`/book/manage/${booking.manageToken}`}
                    className="font-semibold text-navy-700 underline underline-offset-4"
                  >
                    Manage your booking
                  </Link>
                  .
                </p>
              ) : (
                <p className="mt-4 text-base text-ink-700">
                  We&apos;re finalizing your confirmation now — it lands in your inbox within a
                  couple of minutes, calendar invite included.
                </p>
              )}
            </>
          ) : (
            <p className="mt-4 text-base text-ink-700">
              Your payment went through and your confirmation email is on its way. If it
              hasn&apos;t arrived within a few minutes, call us and we&apos;ll sort it instantly.
            </p>
          )}
          <div className="mt-8 flex flex-col items-center gap-3">
            <ButtonLink href="/" variant="secondary">
              Back to the homepage
            </ButtonLink>
            <p className="text-sm text-ink-500">
              Questions?{" "}
              <PhoneLink location="book_success" className="font-bold text-navy-700" /> —{" "}
              {site.hours.short}.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
