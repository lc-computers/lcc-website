import { and, eq, gt, lt, sql } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { bookings, bookingHolds } from "@/lib/db/schema";
import { getCapacity } from "./capacity";
import { getBusyBlocks } from "@/lib/graph";
import type { ResidentialService } from "@/lib/site";
import {
  addDays,
  chicagoDateOf,
  chicagoTimeToUtc,
  dateKey,
  isWeekday,
  type ChicagoDate,
} from "@/lib/time";
import { formatTime } from "@/lib/format";

/**
 * Availability engine.
 * - Slots Mon–Fri 8:00–5:00 America/Chicago.
 * - In-home: 90-minute appointments on the half hour (last start 3:30 PM so the
 *   visit ends by 5:00), plus a 30-minute travel buffer blocked after each one.
 * - Remote: 30-minute slots, no buffer (last start 4:30 PM).
 * - Capacity = technician count, editable in /admin (default 2, see
 *   lib/booking/capacity.ts). A slot is offered while fewer than that many
 *   confirmed bookings / active holds / external busy blocks overlap it.
 *   Customers never pick a technician — assignment is internal.
 */

export const BOOKING_HORIZON_DAYS = 14;
/** Earliest bookable slot: this far in the future. */
export const MIN_LEAD_MS = 2 * 60 * 60 * 1000;

const DAY_START_HOUR = 8;
const DAY_END_HOUR = 17;
const STEP_MINUTES = 30;

export interface SlotCandidate {
  start: Date;
  end: Date;
  blockEnd: Date;
}

interface Interval {
  start: Date;
  end: Date;
}

/** All wall-clock slot candidates for one Chicago weekday. */
export function slotCandidatesForDay(
  service: Pick<ResidentialService, "durationMinutes" | "bufferMinutes">,
  day: ChicagoDate
): SlotCandidate[] {
  const out: SlotCandidate[] = [];
  const lastStartMinutes = DAY_END_HOUR * 60 - service.durationMinutes;
  for (
    let minutes = DAY_START_HOUR * 60;
    minutes <= lastStartMinutes;
    minutes += STEP_MINUTES
  ) {
    const start = chicagoTimeToUtc(day.year, day.month, day.day, Math.floor(minutes / 60), minutes % 60);
    const end = new Date(start.getTime() + service.durationMinutes * 60_000);
    const blockEnd = new Date(end.getTime() + service.bufferMinutes * 60_000);
    out.push({ start, end, blockEnd });
  }
  return out;
}

function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

/**
 * Every capacity-consuming interval in [from, to): confirmed bookings,
 * unexpired holds, and external busy blocks from the shared Graph calendar
 * (excluding events we created ourselves — those are already counted as
 * confirmed bookings).
 */
export async function getBusyIntervals(
  db: Db,
  from: Date,
  to: Date,
  opts?: { excludeBookingId?: string }
): Promise<Interval[]> {
  const confirmed = await db
    .select({
      id: bookings.id,
      startAt: bookings.startAt,
      blockEndAt: bookings.blockEndAt,
      graphEventId: bookings.graphEventId,
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.status, "confirmed"),
        lt(bookings.startAt, to),
        gt(bookings.blockEndAt, from)
      )
    );

  const holds = await db
    .select({
      bookingId: bookingHolds.bookingId,
      startAt: bookingHolds.startAt,
      blockEndAt: bookingHolds.blockEndAt,
    })
    .from(bookingHolds)
    .where(
      and(
        gt(bookingHolds.expiresAt, sql`now()`),
        lt(bookingHolds.startAt, to),
        gt(bookingHolds.blockEndAt, from)
      )
    );

  const ourGraphIds = new Set(
    confirmed.map((b) => b.graphEventId).filter((id): id is string => Boolean(id))
  );
  const graphBusy = (await getBusyBlocks(from, to)).filter((b) => !ourGraphIds.has(b.id));

  const intervals: Interval[] = [];
  for (const b of confirmed) {
    if (opts?.excludeBookingId && b.id === opts.excludeBookingId) continue;
    intervals.push({ start: b.startAt, end: b.blockEndAt });
  }
  for (const h of holds) {
    if (opts?.excludeBookingId && h.bookingId === opts.excludeBookingId) continue;
    intervals.push({ start: h.startAt, end: h.blockEndAt });
  }
  for (const g of graphBusy) {
    intervals.push({ start: g.start, end: g.end });
  }
  return intervals;
}

function slotIsFree(slot: SlotCandidate, busy: Interval[], capacity: number): boolean {
  let overlapping = 0;
  const slotInterval = { start: slot.start, end: slot.blockEnd };
  for (const b of busy) {
    if (overlaps(slotInterval, b)) {
      overlapping += 1;
      if (overlapping >= capacity) return false;
    }
  }
  return true;
}

export interface DayAvailability {
  date: string; // YYYY-MM-DD (Chicago)
  label: string; // "Mon, Jul 20"
  slots: { start: string; label: string }[];
}

/** Public availability for the booking UI. */
export async function getAvailability(
  db: Db,
  service: Pick<ResidentialService, "durationMinutes" | "bufferMinutes">,
  opts?: { days?: number; excludeBookingId?: string }
): Promise<DayAvailability[]> {
  const now = new Date();
  const horizon = opts?.days ?? BOOKING_HORIZON_DAYS;
  const today = chicagoDateOf(now);

  const rangeStart = now;
  const lastDay = addDays(today, horizon);
  const rangeEnd = chicagoTimeToUtc(lastDay.year, lastDay.month, lastDay.day, 23, 59);

  const capacity = await getCapacity(db);
  const busy = await getBusyIntervals(db, rangeStart, rangeEnd, {
    excludeBookingId: opts?.excludeBookingId,
  });

  const days: DayAvailability[] = [];
  const dayLabelFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  for (let i = 0; i <= horizon; i++) {
    const day = addDays(today, i);
    if (!isWeekday(day)) continue;
    const candidates = slotCandidatesForDay(service, day);
    const slots = candidates
      .filter((slot) => slot.start.getTime() - now.getTime() >= MIN_LEAD_MS)
      .filter((slot) => slotIsFree(slot, busy, capacity))
      .map((slot) => ({
        start: slot.start.toISOString(),
        label: formatTime(slot.start),
      }));
    if (slots.length > 0) {
      const noon = chicagoTimeToUtc(day.year, day.month, day.day, 12, 0);
      days.push({ date: dateKey(day), label: dayLabelFmt.format(noon), slots });
    }
  }
  return days;
}

/**
 * Validate that `start` is a legitimate slot for this service (grid-aligned,
 * weekday, business hours, in the future) and currently has capacity.
 * Used inside the checkout transaction and the webhook re-check.
 */
export async function isSlotAvailable(
  db: Db,
  service: Pick<ResidentialService, "durationMinutes" | "bufferMinutes">,
  start: Date,
  opts?: { excludeBookingId?: string; skipLeadCheck?: boolean }
): Promise<{ ok: boolean; reason?: string; slot?: SlotCandidate }> {
  const day = chicagoDateOf(start);
  if (!isWeekday(day)) return { ok: false, reason: "outside_hours" };
  const candidates = slotCandidatesForDay(service, day);
  const slot = candidates.find((c) => c.start.getTime() === start.getTime());
  if (!slot) return { ok: false, reason: "invalid_slot" };
  if (!opts?.skipLeadCheck && slot.start.getTime() - Date.now() < MIN_LEAD_MS) {
    return { ok: false, reason: "too_soon" };
  }
  const capacity = await getCapacity(db);
  const busy = await getBusyIntervals(db, slot.start, slot.blockEnd, {
    excludeBookingId: opts?.excludeBookingId,
  });
  if (!slotIsFree(slot, busy, capacity)) return { ok: false, reason: "slot_taken" };
  return { ok: true, slot };
}

/** Serialize capacity-sensitive writes per Chicago calendar day. */
export async function withSlotLock<T>(
  tx: { execute: (q: ReturnType<typeof sql>) => Promise<unknown> },
  start: Date,
  fn: () => Promise<T>
): Promise<T> {
  const key = `booking:${dateKey(chicagoDateOf(start))}`;
  await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${key}))`);
  return fn();
}
