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

/** "$99" or "$123.45" from integer cents. */
export function formatMoney(cents: number): string {
  const dollars = cents / 100;
  return Number.isInteger(dollars)
    ? `$${dollars.toLocaleString("en-US")}`
    : `$${dollars.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
