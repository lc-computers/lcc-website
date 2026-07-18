import { site } from "@/lib/site";

/**
 * America/Chicago time math without a timezone library.
 * Slots are computed as Chicago wall-clock times and stored as UTC instants.
 */

const TZ = site.timezone;

/** Minutes east of UTC for America/Chicago at the given instant (negative). */
function tzOffsetMinutes(at: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    timeZoneName: "longOffset",
  });
  const name = dtf.formatToParts(at).find((p) => p.type === "timeZoneName")?.value ?? "GMT+00:00";
  const m = name.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!m) return 0;
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3]));
}

/** UTC instant for a Chicago wall-clock time. Handles DST via double resolve. */
export function chicagoTimeToUtc(
  year: number,
  month: number, // 1-12
  day: number,
  hour: number,
  minute: number
): Date {
  let ts = Date.UTC(year, month - 1, day, hour, minute);
  for (let i = 0; i < 2; i++) {
    const offset = tzOffsetMinutes(new Date(ts));
    ts = Date.UTC(year, month - 1, day, hour, minute) - offset * 60_000;
  }
  return new Date(ts);
}

export interface ChicagoDate {
  year: number;
  month: number; // 1-12
  day: number;
  weekday: number; // 0=Sun … 6=Sat
}

/** The Chicago calendar date for a UTC instant. */
export function chicagoDateOf(at: Date): ChicagoDate {
  const dtf = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
  const parts = dtf.formatToParts(at);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    weekday: weekdayMap[get("weekday").replace(".", "")] ?? 0,
  };
}

/** Add n days to a calendar date (pure calendar arithmetic). */
export function addDays(d: ChicagoDate, n: number): ChicagoDate {
  const base = new Date(Date.UTC(d.year, d.month - 1, d.day + n, 12));
  return {
    year: base.getUTCFullYear(),
    month: base.getUTCMonth() + 1,
    day: base.getUTCDate(),
    weekday: base.getUTCDay(),
  };
}

export function isWeekday(d: ChicagoDate): boolean {
  return d.weekday >= 1 && d.weekday <= 5;
}

/** "2026-07-16" key for a Chicago date. */
export function dateKey(d: ChicagoDate): string {
  return `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
}

/** Today's "YYYY-MM-DD" key in Chicago. */
export function chicagoTodayKey(): string {
  return dateKey(chicagoDateOf(new Date()));
}

/** ChicagoDate for a "YYYY-MM-DD" key. */
export function parseDateKey(key: string): ChicagoDate {
  const parts = key.split("-").map(Number);
  const year = parts[0] ?? 0;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  const base = new Date(Date.UTC(year, month - 1, day, 12));
  return { year, month, day, weekday: base.getUTCDay() };
}
