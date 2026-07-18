import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { asc, desc, gte, lt } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getDb, hasDb } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { isAdmin } from "@/lib/admin/auth";
import { loadCatalog } from "@/lib/booking/services";
import { formatDateTime, formatMoney, formatTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Bookings — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  confirmed: "bg-[#E8F2E8] text-[#2D5A2D]",
  completed: "bg-navy-50 text-navy-700",
  pending_payment: "bg-[#FBF3DF] text-brass-700",
  canceled: "bg-cream-100 text-ink-500",
  refunded: "bg-[#F9E7E4] text-[#A03426]",
};

function BookingCard({
  booking,
  serviceNames,
}: {
  booking: typeof bookings.$inferSelect;
  serviceNames: Record<string, string>;
}) {
  const serviceName = serviceNames[booking.serviceSlug];
  return (
    <div className="rounded-lg border border-cream-200 bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-serif text-lg font-semibold text-ink-900">
          {serviceName ?? booking.serviceSlug}
          <span className="ml-2 text-base font-normal text-navy-700">
            {formatMoney(booking.totalCents)}
            {booking.travelFeeCents > 0 ? ` (incl. ${formatMoney(booking.travelFeeCents)} travel)` : ""}
          </span>
        </p>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${statusStyles[booking.status] ?? "bg-cream-100 text-ink-700"}`}
        >
          {booking.status.replace("_", " ")}
        </span>
      </div>
      <p className="mt-1 text-sm font-semibold text-ink-900">
        {formatDateTime(booking.startAt)} – {formatTime(booking.endAt)}
      </p>
      <p className="mt-1.5 text-sm text-ink-700">
        {booking.customerName} ·{" "}
        <a href={`tel:${booking.phone}`} className="text-navy-700 hover:underline">{booking.phone}</a> ·{" "}
        <a href={`mailto:${booking.email}`} className="text-navy-700 hover:underline">{booking.email}</a>
      </p>
      <p className="mt-1 text-sm text-ink-500">
        {booking.street
          ? `${booking.street}, ${booking.city}, KY ${booking.zip}`
          : "Remote session — technician calls the customer"}
        {booking.smsConsent ? " · SMS ok" : ""}
      </p>
    </div>
  );
}

export default async function AdminBookingsPage() {
  if (!(await isAdmin())) redirect("/admin");
  if (!hasDb()) redirect("/admin?error=nodb");
  const db = getDb();
  const now = new Date();
  const [upcoming, past, catalog] = await Promise.all([
    db.select().from(bookings).where(gte(bookings.blockEndAt, now)).orderBy(asc(bookings.startAt)).limit(100),
    db.select().from(bookings).where(lt(bookings.blockEndAt, now)).orderBy(desc(bookings.startAt)).limit(50),
    loadCatalog(),
  ]);
  const serviceNames = Object.fromEntries(catalog.map((s) => [s.slug, s.name]));

  return (
    <Container className="py-10">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to admin
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-ink-900">Bookings</h1>

      <h2 className="mt-8 font-serif text-xl font-semibold text-ink-900">
        Upcoming ({upcoming.length})
      </h2>
      <div className="mt-4 space-y-4">
        {upcoming.length === 0 ? (
          <p className="rounded-lg border border-cream-200 bg-white p-6 text-ink-500 shadow-card">
            Nothing on the calendar yet.
          </p>
        ) : (
          upcoming.map((b) => <BookingCard key={b.id} booking={b} serviceNames={serviceNames} />)
        )}
      </div>

      {past.length > 0 ? (
        <>
          <h2 className="mt-10 font-serif text-xl font-semibold text-ink-900">
            Past ({past.length})
          </h2>
          <div className="mt-4 space-y-4">
            {past.map((b) => (
              <BookingCard key={b.id} booking={b} serviceNames={serviceNames} />
            ))}
          </div>
        </>
      ) : null}
    </Container>
  );
}
