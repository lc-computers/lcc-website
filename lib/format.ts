import { site } from "@/lib/site";

/**
 * Every user-facing date/time on the site renders in America/Chicago.
 */

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: site.timezone,
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: site.timezone,
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: site.timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return `${formatWeekday(date)}, ${formatDate(date)} at ${formatTime(date)} CT`;
}

export function formatWeekday(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: site.timezone,
    weekday: "long",
  }).format(date);
}

/** "Jul 20" (or "Jul 20, 2027" when not this year) from a "YYYY-MM-DD" key. */
export function formatDateKey(key: string): string {
  const parts = key.split("-").map(Number);
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  const sameYear = y === new Date().getFullYear();
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/**
 * Human label for a service's booking window, or null when unbounded.
 * "Jul 20 – Jul 25" / "starting Jul 20" / "through Jul 25".
 */
export function formatBookingWindow(s: {
  bookableFrom?: string | null;
  bookableUntil?: string | null;
}): string | null {
  const from = s.bookableFrom ? formatDateKey(s.bookableFrom) : null;
  const until = s.bookableUntil ? formatDateKey(s.bookableUntil) : null;
  if (from && until) return `${from} – ${until}`;
  if (from) return `starting ${from}`;
  if (until) return `through ${until}`;
  return null;
}

/** "$99" or "$123.45" from integer cents. */
export function formatMoney(cents: number): string {
  const dollars = cents / 100;
  return Number.isInteger(dollars)
    ? `$${dollars.toLocaleString("en-US")}`
    : `$${dollars.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
