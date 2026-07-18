/**
 * Functional test of the DB-backed residential service catalog: price edits,
 * deactivation, new services, and restore. Creates/edits its own rows and
 * puts everything back. Run: npx tsx --env-file=.env.local scripts/test-service-catalog.ts
 */
import { eq } from "drizzle-orm";
import { getDb } from "../lib/db";
import { services } from "../lib/db/schema";
import { getServiceMenu, findService } from "../lib/booking/services";

let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures += 1;
}

async function main() {
  const db = getDb();

  try {
    // Baseline: seeded rows, with fallback copy for legacy null-blurb rows
    const menu = await getServiceMenu();
    check("menu has the seeded services", menu.length >= 5, `${menu.length}`);
    const remote = menu.find((s) => s.slug === "remote-support");
    check("remote-support present at $49", remote?.priceCents === 4900, `${remote?.priceCents}`);
    check(
      "null-blurb rows fall back to seed copy",
      Boolean(remote?.blurb && remote.blurb.length > 20 && remote.includes.length > 0)
    );

    // Price edit is visible immediately (outside a React request, cache() is
    // per-call, so each helper call reads the DB fresh)
    await db.update(services).set({ priceCents: 5900 }).where(eq(services.slug, "remote-support"));
    const edited = await findService("remote-support");
    check("price edit visible: $59", edited?.priceCents === 5900, `${edited?.priceCents}`);
    check("priceDisplay recomputed", edited?.priceDisplay === "$59", edited?.priceDisplay);

    // Deactivate: gone from menu and new-booking lookups, but still
    // resolvable for existing bookings
    await db.update(services).set({ active: false }).where(eq(services.slug, "remote-support"));
    const menuOff = await getServiceMenu();
    check("deactivated service leaves the menu", !menuOff.some((s) => s.slug === "remote-support"));
    check("findService hides it", (await findService("remote-support")) === undefined);
    const stillThere = await findService("remote-support", { includeInactive: true });
    check("includeInactive still resolves it (old bookings)", stillThere?.priceCents === 5900);

    // Brand-new service with its own copy
    await db.insert(services).values({
      slug: "catalog-test-printer",
      name: "Printer Setup (TEST)",
      priceCents: 7900,
      kind: "in_home",
      durationMinutes: 90,
      bufferMinutes: 30,
      blurb: "Test blurb",
      includes: ["Line one", "Line two"],
      active: true,
      sortOrder: 98,
    });
    const withNew = await getServiceMenu();
    const added = withNew.find((s) => s.slug === "catalog-test-printer");
    check("new service appears in menu", Boolean(added));
    check(
      "new service copy comes from DB",
      added?.blurb === "Test blurb" && added?.includes.length === 2
    );
    check("new service price formats", added?.priceDisplay === "$79", added?.priceDisplay);
  } finally {
    await db.delete(services).where(eq(services.slug, "catalog-test-printer"));
    await db
      .update(services)
      .set({ priceCents: 4900, active: true })
      .where(eq(services.slug, "remote-support"));
  }

  const restored = await findService("remote-support");
  check("restored: remote-support $49 active", restored?.priceCents === 4900);

  console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
