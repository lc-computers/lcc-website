import { eq } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { appSettings } from "@/lib/db/schema";

/**
 * Concurrent-appointment capacity = number of technicians taking
 * appointments, editable from /admin. A slot is offered while fewer than
 * this many confirmed bookings / active holds / external busy blocks
 * overlap it. Customers never pick a technician — assignment is internal.
 */

export const CAPACITY_SETTING_KEY = "technician_count";
export const DEFAULT_CAPACITY = 2;
export const MIN_CAPACITY = 1;
export const MAX_CAPACITY = 4;

export function clampCapacity(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_CAPACITY;
  return Math.min(MAX_CAPACITY, Math.max(MIN_CAPACITY, Math.round(n)));
}

/** Read the configured capacity (defaults to 2 when unset or unreadable). */
export async function getCapacity(db: Db): Promise<number> {
  try {
    const [row] = await db
      .select({ value: appSettings.value })
      .from(appSettings)
      .where(eq(appSettings.key, CAPACITY_SETTING_KEY));
    if (!row) return DEFAULT_CAPACITY;
    return clampCapacity(Number(row.value));
  } catch (err) {
    console.error("capacity: read failed, using default", err);
    return DEFAULT_CAPACITY;
  }
}

export async function setCapacity(db: Db, n: number): Promise<number> {
  const value = clampCapacity(n);
  await db
    .insert(appSettings)
    .values({ key: CAPACITY_SETTING_KEY, value: String(value), updatedAt: new Date() })
    .onConflictDoUpdate({
      target: appSettings.key,
      set: { value: String(value), updatedAt: new Date() },
    });
  return value;
}
