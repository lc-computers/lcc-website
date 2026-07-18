/**
 * Functional test of limited-time booking windows: menu visibility, window
 * badge data, availability day clamping, and slot validation — against the
 * real DB. Creates its own rows and cleans up.
 * Run: npx tsx --env-file=.env.local scripts/test-promo-window.ts
 */
import { eq } from "drizzle-orm";
import { getDb } from "../lib/db";
import { services } from "../lib/db/schema";
import { getServiceMenu, findService, serviceWindowEnded } from "../lib/booking/services";
import { getAvailability, isSlotAvailable, dayInWindow } from "../lib/booking/availability";
import { addDays, chicagoDateOf, chicagoTimeToUtc, dateKey, parseDateKey } from "../lib/time";
import { formatBookingWindow } from "../lib/format";

const SLUG = "promo-window-test";

let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures += 1;
}

/** Next weekday on/after the given date. */
function nextWeekday(d: ReturnType<typeof addDays>): ReturnType<typeof addDays> {
  let out = d;
  while (out.weekday === 0 || out.weekday === 6) out = addDays(out, 1);
  return out;
}

async function main() {
  const db = getDb();
  const today = chicagoDateOf(new Date());

  // Window: a weekday 3 days out through 3 days after that (promo-style).
  const fromDay = nextWeekday(addDays(today, 3));
  const untilDay = addDays(fromDay, 3);
  const fromKey = dateKey(fromDay);
  const untilKey = dateKey(untilDay);

  try {
    await db.insert(services).values({
      slug: SLUG,
      name: "Free Checkup (TEST PROMO)",
      priceCents: 0,
      kind: "remote",
      durationMinutes: 30,
      bufferMinutes: 0,
      blurb: "Test promo",
      includes: ["Test"],
      active: true,
      sortOrder: 99,
      bookableFrom: fromKey,
      bookableUntil: untilKey,
    });

    // Catalog surface
    const promo = await findService(SLUG);
    check("windowed promo is on the menu", (await getServiceMenu()).some((s) => s.slug === SLUG));
    check("window fields load from DB", promo?.bookableFrom === fromKey && promo?.bookableUntil === untilKey);
    check("window label renders", Boolean(promo && formatBookingWindow(promo)), promo ? String(formatBookingWindow(promo)) : "");

    // Pure window math
    check("dayInWindow: before window", !dayInWindow(promo!, dateKey(addDays(fromDay, -1))));
    check("dayInWindow: first day", dayInWindow(promo!, fromKey));
    check("dayInWindow: last day", dayInWindow(promo!, untilKey));
    check("dayInWindow: after window", !dayInWindow(promo!, dateKey(addDays(untilDay, 1))));

    // Availability only offers in-window days
    const days = await getAvailability(db, promo!);
    const outOfWindow = days.filter((d) => d.date < fromKey || d.date > untilKey);
    check("availability returns some window days", days.length > 0, `${days.length} day(s)`);
    check("availability offers zero out-of-window days", outOfWindow.length === 0, outOfWindow.map((d) => d.date).join(","));

    // Slot validation rejects out-of-window dates outright
    const beforeDay = nextWeekday(addDays(today, 1));
    const before = await isSlotAvailable(db, promo!, chicagoTimeToUtc(beforeDay.year, beforeDay.month, beforeDay.day, 9, 0));
    check("isSlotAvailable rejects pre-window date", !before.ok && before.reason === "outside_window", before.reason);
    const afterDay = nextWeekday(addDays(untilDay, 1));
    const after = await isSlotAvailable(db, promo!, chicagoTimeToUtc(afterDay.year, afterDay.month, afterDay.day, 9, 0));
    check("isSlotAvailable rejects post-window date", !after.ok && after.reason === "outside_window", after.reason);
    const inDay = nextWeekday(fromDay);
    const inside = await isSlotAvailable(db, promo!, chicagoTimeToUtc(inDay.year, inDay.month, inDay.day, 9, 0));
    check("isSlotAvailable accepts in-window weekday slot", inside.ok, inside.reason);

    // Far-future promo still shows its days (scan starts at the window)
    const farFrom = nextWeekday(addDays(today, 25));
    await db
      .update(services)
      .set({ bookableFrom: dateKey(farFrom), bookableUntil: dateKey(addDays(farFrom, 4)) })
      .where(eq(services.slug, SLUG));
    const farDays = await getAvailability(db, (await findService(SLUG))!);
    check("promo beyond 14-day horizon still shows days", farDays.length > 0, `${farDays.length} day(s)`);

    // Expired promo: off the menu, unbookable for new bookings, still resolvable for old ones
    const pastFrom = dateKey(addDays(today, -10));
    const pastUntil = dateKey(addDays(today, -5));
    await db
      .update(services)
      .set({ bookableFrom: pastFrom, bookableUntil: pastUntil })
      .where(eq(services.slug, SLUG));
    const expired = await findService(SLUG, { includeInactive: true });
    check("serviceWindowEnded flags expired promo", Boolean(expired && serviceWindowEnded(expired)));
    check("expired promo leaves the menu", !(await getServiceMenu()).some((s) => s.slug === SLUG));
    check("expired promo hidden from new-booking lookups", (await findService(SLUG)) === undefined);
    check("expired promo still resolvable for old bookings", expired?.slug === SLUG);
    check("expired promo has zero availability", (await getAvailability(db, expired!)).length === 0);

    // Open-ended window (from only): available from that date forever
    await db
      .update(services)
      .set({ bookableFrom: fromKey, bookableUntil: null })
      .where(eq(services.slug, SLUG));
    const openEnded = await findService(SLUG);
    check("from-only service is on the menu", Boolean(openEnded));
    check("from-only label", formatBookingWindow(openEnded!)?.startsWith("starting") === true, String(formatBookingWindow(openEnded!)));

    // parseDateKey round-trip sanity
    const rt = parseDateKey(fromKey);
    check("parseDateKey round-trips", dateKey(rt) === fromKey && rt.weekday === fromDay.weekday);
  } finally {
    await db.delete(services).where(eq(services.slug, SLUG));
  }

  check("test service cleaned up", (await findService(SLUG, { includeInactive: true })) === undefined);

  console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
