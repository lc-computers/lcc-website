/**
 * Functional test of the availability engine against a real database:
 * capacity-2 behavior, holds, hold expiry, and reschedule exclusion.
 * Creates its own rows and cleans them up. Run: npx tsx scripts/test-booking-engine.ts
 */
import { inArray } from "drizzle-orm";
import { getDb } from "../lib/db";
import { bookings, bookingHolds } from "../lib/db/schema";
import { getAvailability, isSlotAvailable } from "../lib/booking/availability";
import { getCapacity, setCapacity } from "../lib/booking/capacity";
import { travelFeeCents } from "../lib/booking/travel-fee";
import { getResidentialService } from "../lib/site";

let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures += 1;
}

async function main() {
  const db = getDb();
  const inHome = getResidentialService("virus-malware-removal")!;
  const testIds: string[] = [];

  const mkBooking = async (
    startISO: string,
    status: string,
    blockMinutes: number
  ): Promise<string> => {
    const start = new Date(startISO);
    const end = new Date(start.getTime() + inHome.durationMinutes * 60_000);
    const blockEnd = new Date(start.getTime() + blockMinutes * 60_000);
    const [row] = await db
      .insert(bookings)
      .values({
        serviceSlug: inHome.slug,
        status,
        customerName: "Engine Test",
        email: "engine-test@example.com",
        phone: "(270) 555-0100",
        street: "1 Test St",
        city: "Russell Springs",
        zip: "42642",
        priceCents: inHome.priceCents,
        travelFeeCents: 0,
        totalCents: inHome.priceCents,
        startAt: start,
        endAt: end,
        blockEndAt: blockEnd,
        manageToken: `engine-test-${Math.random().toString(36).slice(2)}`,
      })
      .returning({ id: bookings.id });
    testIds.push(row!.id);
    return row!.id;
  };

  // Steps 2-6 assume capacity 2; pin it and restore the admin's value after.
  const originalCapacity = await getCapacity(db);
  await setCapacity(db, 2);

  try {
    // 1. Baseline availability
    const days = await getAvailability(db, inHome);
    check("availability returns weekday slots", days.length > 0, `${days.length} days`);
    const day = days.find((d) => d.slots.length >= 3);
    if (!day) throw new Error("need a day with 3+ open slots to test");
    const slotISO = day.slots[0]!.start;
    check(
      "slots are inside business hours (CT)",
      days.every((d) =>
        d.slots.every((s) => {
          const label = s.label; // e.g. "8:00 AM"
          return !/^(?:6|7):\d{2} AM$/.test(label) && !/(?:5|6|7|8|9):\d{2} PM$/.test(label);
        })
      )
    );

    // 2. One confirmed booking → slot still open (capacity 2)
    await mkBooking(slotISO, "confirmed", 120);
    let result = await isSlotAvailable(db, inHome, new Date(slotISO));
    check("slot open with 1/2 capacity used", result.ok);

    // 3. Two confirmed bookings → slot gone
    const secondId = await mkBooking(slotISO, "confirmed", 120);
    result = await isSlotAvailable(db, inHome, new Date(slotISO));
    check("slot blocked at 2/2 capacity", !result.ok && result.reason === "slot_taken");
    const daysAfter = await getAvailability(db, inHome);
    const dayAfter = daysAfter.find((d) => d.date === day.date);
    check(
      "availability list drops the full slot",
      !(dayAfter?.slots ?? []).some((s) => s.start === slotISO)
    );

    // 4. Reschedule exclusion: excluding one of the two makes it available
    result = await isSlotAvailable(db, inHome, new Date(slotISO), {
      excludeBookingId: secondId,
    });
    check("excludeBookingId frees own capacity (reschedule)", result.ok);

    // 5. Holds consume capacity while unexpired… (different day, so the
    // capacity bookings from steps 2-3 — which block start+120min — can't
    // overlap this slot)
    const otherDay = days.find((d) => d.date !== day.date && d.slots.length > 0);
    if (!otherDay) throw new Error("need a second day with open slots to test holds");
    const freeSlot = otherDay.slots[0]!.start;
    const pendingId = await mkBooking(freeSlot, "pending_payment", 120);
    await db.insert(bookingHolds).values({
      bookingId: pendingId,
      startAt: new Date(freeSlot),
      blockEndAt: new Date(new Date(freeSlot).getTime() + 120 * 60_000),
      expiresAt: new Date(Date.now() + 60_000),
    });
    await mkBooking(freeSlot, "confirmed", 120); // 1 confirmed + 1 hold = 2/2
    result = await isSlotAvailable(db, inHome, new Date(freeSlot));
    check("active hold consumes capacity", !result.ok);

    // 6. …and release it on expiry (no cleanup required). Expire well into
    // the past — the comparison runs against the DB server's clock.
    await db
      .update(bookingHolds)
      .set({ expiresAt: new Date(Date.now() - 5 * 60_000) })
      .where(inArray(bookingHolds.bookingId, [pendingId]));
    result = await isSlotAvailable(db, inHome, new Date(freeSlot));
    check("expired hold releases the slot", result.ok, result.reason ?? "");

    // 7. Slot-grid validation
    const misaligned = new Date(new Date(slotISO).getTime() + 7 * 60_000);
    result = await isSlotAvailable(db, inHome, misaligned);
    check("off-grid start rejected", !result.ok && result.reason === "invalid_slot");

    // 8. Travel fee rule
    check("no fee: Russell Springs by name", travelFeeCents(inHome, "Russell Springs", "42501") === 0);
    check("no fee: zip 42642", travelFeeCents(inHome, "Somewhere", "42642") === 0);
    check("$25 fee: surrounding county", travelFeeCents(inHome, "Somerset", "42501") === 2500);
    check("no fee ever: remote", travelFeeCents({ kind: "remote" }, "Albany", "42602") === 0);

    // 9. Admin-configurable capacity: at 1 technician, a single confirmed
    // booking fills the slot (use a third day untouched by earlier steps).
    const soloDay = days.find(
      (d) => d.date !== day.date && d.slots.length > 0 && (!otherDay || d.date !== otherDay.date)
    );
    if (!soloDay) throw new Error("need a third day with open slots to test capacity 1");
    const soloSlot = soloDay.slots[0]!.start;
    await setCapacity(db, 1);
    check("setCapacity(1) persists", (await getCapacity(db)) === 1);
    result = await isSlotAvailable(db, inHome, new Date(soloSlot));
    check("capacity 1: empty slot still open", result.ok);
    await mkBooking(soloSlot, "confirmed", 120);
    result = await isSlotAvailable(db, inHome, new Date(soloSlot));
    check("capacity 1: one booking fills the slot", !result.ok && result.reason === "slot_taken");
    const soloDays = await getAvailability(db, inHome);
    check(
      "capacity 1: availability list drops it too",
      !(soloDays.find((d) => d.date === soloDay.date)?.slots ?? []).some((s) => s.start === soloSlot)
    );
    await setCapacity(db, 2);
    result = await isSlotAvailable(db, inHome, new Date(soloSlot));
    check("back at capacity 2: same slot reopens", result.ok);
  } finally {
    await setCapacity(db, originalCapacity);
    if (testIds.length > 0) {
      await db.delete(bookingHolds).where(inArray(bookingHolds.bookingId, testIds));
      await db.delete(bookings).where(inArray(bookings.id, testIds));
      console.log(`cleaned up ${testIds.length} test bookings`);
    }
  }

  console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
