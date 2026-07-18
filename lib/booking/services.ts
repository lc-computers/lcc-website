import { asc } from "drizzle-orm";
import { cache } from "react";
import { getDb, hasDb } from "@/lib/db";
import { services } from "@/lib/db/schema";
import {
  formatCents,
  residentialServices,
  type ResidentialService,
  type ResidentialServiceKind,
} from "@/lib/site";

/**
 * Residential service catalog. The `services` table is the source of truth —
 * name, price, duration, and copy are all editable from /admin/services.
 * The hardcoded menu in lib/site.ts is the seed and the fallback when the
 * database is unconfigured or unreachable, so the site never renders an
 * empty menu.
 */

export interface CatalogService extends ResidentialService {
  active: boolean;
  sortOrder: number;
}

type ServiceRow = typeof services.$inferSelect;

function fallbackCatalog(): CatalogService[] {
  return residentialServices.map((s, i) => ({ ...s, active: true, sortOrder: i }));
}

function rowToService(row: ServiceRow): CatalogService {
  const seed = residentialServices.find((s) => s.slug === row.slug);
  const kind: ResidentialServiceKind = row.kind === "remote" ? "remote" : "in_home";
  return {
    slug: row.slug,
    name: row.name,
    priceCents: row.priceCents,
    priceDisplay: row.priceCents === 0 ? "Free" : formatCents(row.priceCents),
    kind,
    durationMinutes: row.durationMinutes,
    bufferMinutes: row.bufferMinutes,
    blurb: row.blurb ?? seed?.blurb ?? "",
    includes: row.includes ?? seed?.includes ?? [],
    active: row.active,
    sortOrder: row.sortOrder,
  };
}

/** Every service row (active and inactive), deduped per request. */
export const loadCatalog = cache(async (): Promise<CatalogService[]> => {
  if (!hasDb()) return fallbackCatalog();
  try {
    const rows = await getDb()
      .select()
      .from(services)
      .orderBy(asc(services.sortOrder), asc(services.name));
    if (rows.length === 0) return fallbackCatalog();
    return rows.map(rowToService);
  } catch (err) {
    console.error("services: catalog read failed, using built-in menu", err);
    return fallbackCatalog();
  }
});

/** Active services in display order — the public menu. */
export async function getServiceMenu(): Promise<CatalogService[]> {
  return (await loadCatalog()).filter((s) => s.active);
}

/**
 * Look up one service. Active-only by default (booking new appointments);
 * pass includeInactive for existing bookings, whose service may since have
 * been turned off.
 */
export async function findService(
  slug: string,
  opts?: { includeInactive?: boolean }
): Promise<CatalogService | undefined> {
  const all = await loadCatalog();
  const found = all.find((s) => s.slug === slug);
  if (!found) return undefined;
  if (!found.active && !opts?.includeInactive) return undefined;
  return found;
}
