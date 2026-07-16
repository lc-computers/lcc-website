import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ManageBooking } from "@/components/booking/ManageBooking";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { getDb, hasDb } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { getResidentialService, site } from "@/lib/site";
import { formatDateTime, formatMoney, formatTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Manage Your Booking",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function ManageBookingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!hasDb()) notFound();
  const db = getDb();
  const [booking] = await db.select().from(bookings).where(eq(bookings.manageToken, token));
  if (!booking) notFound();
  const service = getResidentialService(booking.serviceSlug);
  if (!service) notFound();

  const isPast = booking.startAt.getTime() < Date.now();
  const canCancelOnline = booking.startAt.getTime() - Date.now() >= 24 * 60 * 60 * 1000;
  const isActive = booking.status === "confirmed" && !isPast;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          <p className="eyebrow">Your booking</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-ink-900 sm:text-4xl">
            {service.name}
          </h1>

          <dl className="mt-6 space-y-2 rounded-lg border border-cream-200 bg-white p-6 shadow-card">
            <div className="flex justify-between gap-4">
              <dt className="text-sm font-semibold text-ink-500">When</dt>
              <dd className="text-right font-medium text-ink-900">
                {formatDateTime(booking.startAt)} – {formatTime(booking.endAt)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sm font-semibold text-ink-500">
                {service.kind === "remote" ? "How" : "Where"}
              </dt>
              <dd className="text-right font-medium text-ink-900">
                {service.kind === "remote"
                  ? `We call ${booking.phone}`
                  : `${booking.street}, ${booking.city}, KY ${booking.zip}`}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sm font-semibold text-ink-500">Paid</dt>
              <dd className="text-right font-medium text-ink-900">
                {formatMoney(booking.totalCents)}
                {booking.travelFeeCents > 0
                  ? ` (incl. ${formatMoney(booking.travelFeeCents)} travel fee)`
                  : ""}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sm font-semibold text-ink-500">Status</dt>
              <dd className="text-right font-semibold capitalize text-navy-700">
                {booking.status.replace("_", " ")}
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            {isActive ? (
              <>
                <ManageBooking
                  token={token}
                  bookingId={booking.id}
                  serviceSlug={service.slug}
                  canCancelOnline={canCancelOnline}
                />
                <p className="mt-6 text-sm text-ink-500">{site.cancellation.policy}</p>
              </>
            ) : (
              <div className="rounded-lg border border-cream-200 bg-cream-100 p-6">
                <p className="text-base text-ink-700">
                  {booking.status === "pending_payment"
                    ? "This booking was never paid for, so there's nothing to manage — book a fresh appointment anytime."
                    : isPast && booking.status === "confirmed"
                      ? "This appointment has already happened. Need us again?"
                      : "This booking is no longer active. Need us again?"}
                </p>
                <ButtonLink href="/book" className="mt-4">
                  Book a new appointment
                </ButtonLink>
              </div>
            )}
          </div>

          <p className="mt-10 text-sm text-ink-500">
            Anything unusual?{" "}
            <PhoneLink location="manage_booking" className="font-bold text-navy-700" /> — we&apos;ll
            take care of it.
          </p>
        </div>
      </Container>
    </section>
  );
}
